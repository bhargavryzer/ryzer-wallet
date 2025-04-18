import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { UserPreferences } from '../schemas/user-preferences.schema';
import { UserActivity, ActivityType } from '../schemas/user-activity.schema';
import { Role, Permission } from '../schemas/role.schema';
import { OAuth, OAuthProvider } from '../schemas/oauth.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UpdateSettingsDto } from '../dto/update-settings.dto';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel('UserPreferences') private preferencesModel: Model<UserPreferences>,
    @InjectModel('UserActivity') private activityModel: Model<UserActivity>,
    @InjectModel('Role') private roleModel: Model<Role>,
    @InjectModel('OAuth') private oauthModel: Model<OAuth>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, ...rest } = createUserDto;

    // Check if user exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new this.userModel({
      email,
      password: hashedPassword,
      ...rest,
      metadata: {
        language: rest.language || 'en',
        timezone: rest.timezone || 'UTC',
        theme: rest.theme || 'light',
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
      },
    });

    await user.save();
    await this.recordActivity(user._id, ActivityType.PROFILE_UPDATE, 'User account created');

    return user;
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user
    Object.assign(user, updateUserDto);
    await user.save();

    await this.recordActivity(userId, ActivityType.PROFILE_UPDATE, 'User profile updated');

    return user;
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid current password');
    }

    // Verify 2FA if enabled
    if (user.twoFactorEnabled && changePasswordDto.twoFactorCode) {
      const isValid = this.verifyTwoFactorCode(user.twoFactorSecret, changePasswordDto.twoFactorCode);
      if (!isValid) {
        throw new BadRequestException('Invalid 2FA code');
      }
    }

    // Update password
    user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await user.save();

    await this.recordActivity(userId, ActivityType.PASSWORD_CHANGE, 'Password changed');
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update profile
    Object.assign(user, updateProfileDto);
    await user.save();

    await this.recordActivity(userId, ActivityType.PROFILE_UPDATE, 'Profile updated');

    return user;
  }

  async updateSettings(userId: string, updateSettingsDto: UpdateSettingsDto): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update settings
    Object.assign(user.metadata, updateSettingsDto);
    await user.save();

    await this.recordActivity(userId, ActivityType.SETTINGS_UPDATE, 'Settings updated');

    return user;
  }

  async enableTwoFactor(userId: string): Promise<{ secret: string; qrCode: string }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate 2FA secret
    const secret = speakeasy.generateSecret({
      name: `Ryzer:${user.email}`,
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    // Save secret
    user.twoFactorSecret = secret.base32;
    user.twoFactorEnabled = true;
    await user.save();

    await this.recordActivity(userId, ActivityType.TWO_FACTOR_ENABLE, '2FA enabled');

    return {
      secret: secret.base32,
      qrCode,
    };
  }

  async disableTwoFactor(userId: string, code: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify code
    const isValid = this.verifyTwoFactorCode(user.twoFactorSecret, code);
    if (!isValid) {
      throw new BadRequestException('Invalid 2FA code');
    }

    // Disable 2FA
    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    await user.save();

    await this.recordActivity(userId, ActivityType.TWO_FACTOR_DISABLE, '2FA disabled');
  }

  async registerPasskey(userId: string, credential: any): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Add passkey credential
    if (!user.passkeyCredentials) {
      user.passkeyCredentials = [];
    }

    user.passkeyCredentials.push({
      id: credential.id,
      publicKey: credential.publicKey,
      algorithm: credential.algorithm,
      counter: credential.counter,
    });

    await user.save();

    await this.recordActivity(userId, ActivityType.PASSKEY_REGISTER, 'Passkey registered');
  }

  async removePasskey(userId: string, credentialId: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove passkey credential
    user.passkeyCredentials = user.passkeyCredentials.filter(
      (credential) => credential.id !== credentialId,
    );

    await user.save();

    await this.recordActivity(userId, ActivityType.PASSKEY_REMOVE, 'Passkey removed');
  }

  async getUserActivity(userId: string, options: {
    limit?: number;
    offset?: number;
    type?: ActivityType;
  }): Promise<{ activities: UserActivity[]; total: number }> {
    const query: any = { userId };
    if (options.type) {
      query.type = options.type;
    }

    const activities = await this.activityModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(options.offset || 0)
      .limit(options.limit || 10);

    const total = await this.activityModel.countDocuments(query);

    return { activities, total };
  }

  async updatePreferences(userId: string, data: Partial<UserPreferences>) {
    const preferences = await this.preferencesModel.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true, upsert: true },
    );

    await this.recordActivity(userId, ActivityType.SETTINGS_UPDATE, 'Preferences updated');

    return preferences;
  }

  async updateRole(userId: string, roleId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.roleModel.findById(roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    user.role = role._id;
    await user.save();

    await this.recordActivity(userId, ActivityType.PROFILE_UPDATE, `Role updated to ${role.name}`);

    return user;
  }

  async connectOAuth(userId: string, provider: OAuthProvider, data: {
    providerId: string;
    accessToken: string;
    refreshToken: string;
    profile: any;
  }) {
    const oauth = await this.oauthModel.findOneAndUpdate(
      { userId, provider },
      {
        providerId: data.providerId,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        profile: data.profile,
        status: 'ACTIVE',
        metadata: {
          lastUsed: new Date(),
          connectedAt: new Date(),
        },
      },
      { upsert: true, new: true },
    );

    await this.recordActivity(userId, ActivityType.PROFILE_UPDATE, `Connected ${provider} account`);

    return oauth;
  }

  async disconnectOAuth(userId: string, provider: OAuthProvider) {
    const oauth = await this.oauthModel.findOneAndUpdate(
      { userId, provider },
      {
        status: 'REVOKED',
        metadata: {
          disconnectedAt: new Date(),
        },
      },
    );

    if (!oauth) {
      throw new NotFoundException('OAuth connection not found');
    }

    await this.recordActivity(userId, ActivityType.PROFILE_UPDATE, `Disconnected ${provider} account`);

    return oauth;
  }

  async searchUsers(query: {
    search?: string;
    role?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) {
    const filter: any = {};

    if (query.search) {
      filter.$or = [
        { email: { $regex: query.search, $options: 'i' } },
        { name: { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.role) {
      filter.role = query.role;
    }

    if (query.status) {
      filter.status = query.status;
    }

    const users = await this.userModel
      .find(filter)
      .populate('role')
      .skip(query.offset || 0)
      .limit(query.limit || 10);

    const total = await this.userModel.countDocuments(filter);

    return {
      users,
      total,
      limit: query.limit || 10,
      offset: query.offset || 0,
    };
  }

  async exportUserData(userId: string) {
    const user = await this.userModel.findById(userId).populate('role');
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const preferences = await this.preferencesModel.findOne({ userId });
    const activities = await this.activityModel.find({ userId });
    const oauthConnections = await this.oauthModel.find({ userId });

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      preferences,
      activities,
      oauthConnections,
    };
  }

  private verifyTwoFactorCode(secret: string, code: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: code,
    });
  }

  private async recordActivity(userId: string, type: ActivityType, description: string): Promise<void> {
    const activity = new this.activityModel({
      userId,
      type,
      description,
    });
    await activity.save();
  }
} 