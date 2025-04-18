import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TwoFactorAuth, TwoFactorMethod, TwoFactorStatus } from '../schemas/two-factor-auth.schema';
import { UserActivity, ActivityType } from '../schemas/user-preferences.schema';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { User } from '../schemas/user.schema';

@Injectable()
export class TwoFactorService {
  constructor(
    @InjectModel('TwoFactorAuth') private twoFactorModel: Model<TwoFactorAuth>,
    @InjectModel('UserActivity') private activityModel: Model<UserActivity>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async setupAuthenticator(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `Ryzer:${user.email}`,
    });

    // Generate QR code
    const qrCode = await qrcode.toDataURL(secret.otpauth_url);

    // Create or update 2FA record
    await this.twoFactorModel.findOneAndUpdate(
      { userId },
      {
        method: TwoFactorMethod.AUTHENTICATOR,
        status: TwoFactorStatus.PENDING,
        secret: secret.base32,
        metadata: {
          setupDate: new Date(),
        },
      },
      { upsert: true, new: true },
    );

    await this.recordActivity(userId, ActivityType.TWO_FACTOR_CHANGE, 'Started 2FA setup with authenticator');

    return {
      secret: secret.base32,
      qrCode,
    };
  }

  async verifySetup(userId: string, code: string) {
    const twoFactor = await this.twoFactorModel.findOne({ userId });
    if (!twoFactor || twoFactor.status !== TwoFactorStatus.PENDING) {
      throw new BadRequestException('No pending 2FA setup found');
    }

    const isValid = speakeasy.totp.verify({
      secret: twoFactor.secret,
      encoding: 'base32',
      token: code,
    });

    if (!isValid) {
      throw new BadRequestException('Invalid verification code');
    }

    twoFactor.status = TwoFactorStatus.ENABLED;
    await twoFactor.save();

    await this.recordActivity(userId, ActivityType.TWO_FACTOR_CHANGE, 'Completed 2FA setup with authenticator');

    return { success: true };
  }

  async setupSms(userId: string, phoneNumber: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // TODO: Send SMS with verification code
    // This is a placeholder for actual SMS sending logic

    await this.twoFactorModel.findOneAndUpdate(
      { userId },
      {
        method: TwoFactorMethod.SMS,
        status: TwoFactorStatus.PENDING,
        phoneNumber,
        metadata: {
          setupDate: new Date(),
          verificationCode: code,
          verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        },
      },
      { upsert: true, new: true },
    );

    await this.recordActivity(userId, ActivityType.TWO_FACTOR_CHANGE, 'Started 2FA setup with SMS');

    return { success: true };
  }

  async verifySmsSetup(userId: string, code: string) {
    const twoFactor = await this.twoFactorModel.findOne({ userId });
    if (!twoFactor || twoFactor.status !== TwoFactorStatus.PENDING) {
      throw new BadRequestException('No pending 2FA setup found');
    }

    if (
      twoFactor.metadata.verificationCode !== code ||
      new Date() > twoFactor.metadata.verificationCodeExpires
    ) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    twoFactor.status = TwoFactorStatus.ENABLED;
    await twoFactor.save();

    await this.recordActivity(userId, ActivityType.TWO_FACTOR_CHANGE, 'Completed 2FA setup with SMS');

    return { success: true };
  }

  async disableTwoFactor(userId: string) {
    const twoFactor = await this.twoFactorModel.findOne({ userId });
    if (!twoFactor) {
      throw new BadRequestException('2FA is not enabled');
    }

    twoFactor.status = TwoFactorStatus.DISABLED;
    await twoFactor.save();

    await this.recordActivity(userId, ActivityType.TWO_FACTOR_CHANGE, 'Disabled 2FA');

    return { success: true };
  }

  async generateBackupCodes(userId: string) {
    const twoFactor = await this.twoFactorModel.findOne({ userId });
    if (!twoFactor || twoFactor.status !== TwoFactorStatus.ENABLED) {
      throw new BadRequestException('2FA is not enabled');
    }

    const backupCodes = Array.from({ length: 10 }, () => ({
      code: Math.random().toString(36).substring(2, 10).toUpperCase(),
      used: false,
    }));

    twoFactor.backupCodes = backupCodes;
    await twoFactor.save();

    await this.recordActivity(userId, ActivityType.TWO_FACTOR_CHANGE, 'Generated new backup codes');

    return { backupCodes };
  }

  private async recordActivity(userId: string, type: ActivityType, description: string) {
    const activity = new this.activityModel({
      userId,
      type,
      description,
    });
    await activity.save();
  }
} 