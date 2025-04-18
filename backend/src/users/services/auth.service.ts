import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';
import { Session, LoginAttempt } from '../schemas/session.schema';
import { TwoFactorAuth } from '../schemas/two-factor-auth.schema';
import { UserActivity } from '../schemas/user-preferences.schema';
import { ActivityType } from '../schemas/user-preferences.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Session') private sessionModel: Model<Session>,
    @InjectModel('LoginAttempt') private loginAttemptModel: Model<LoginAttempt>,
    @InjectModel('TwoFactorAuth') private twoFactorModel: Model<TwoFactorAuth>,
    @InjectModel('UserActivity') private activityModel: Model<UserActivity>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await this.recordFailedLoginAttempt(user._id);
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: any, ipAddress: string, userAgent: string) {
    // Check if user is blocked
    const isBlocked = await this.checkLoginAttempts(user._id, ipAddress);
    if (isBlocked) {
      throw new UnauthorizedException('Account temporarily blocked due to too many failed attempts');
    }

    // Check 2FA status
    const twoFactor = await this.twoFactorModel.findOne({ userId: user._id });
    if (twoFactor?.status === 'ENABLED') {
      return { requiresTwoFactor: true, userId: user._id };
    }

    // Create session
    const session = await this.createSession(user._id, ipAddress, userAgent);
    
    // Record successful login
    await this.recordSuccessfulLogin(user._id, ipAddress);
    await this.recordActivity(user._id, ActivityType.LOGIN, 'User logged in successfully');

    return {
      accessToken: session.token,
      refreshToken: session.refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async verifyTwoFactor(userId: string, code: string, ipAddress: string, userAgent: string) {
    const twoFactor = await this.twoFactorModel.findOne({ userId });
    if (!twoFactor || twoFactor.status !== 'ENABLED') {
      throw new BadRequestException('Two-factor authentication is not enabled');
    }

    // Verify 2FA code (implementation depends on the 2FA method)
    const isValid = await this.verifyTwoFactorCode(twoFactor, code);
    if (!isValid) {
      throw new UnauthorizedException('Invalid two-factor code');
    }

    // Create session
    const session = await this.createSession(userId, ipAddress, userAgent);
    await this.recordActivity(userId, ActivityType.LOGIN, 'User logged in with 2FA');

    return {
      accessToken: session.token,
      refreshToken: session.refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    const session = await this.sessionModel.findOne({ refreshToken });
    if (!session || session.status !== 'ACTIVE') {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newToken = this.jwtService.sign({ sub: session.userId });
    session.token = newToken;
    await session.save();

    return { accessToken: newToken };
  }

  async logout(userId: string, sessionId: string) {
    await this.sessionModel.findByIdAndUpdate(sessionId, { status: 'REVOKED' });
    await this.recordActivity(userId, ActivityType.LOGOUT, 'User logged out');
  }

  private async createSession(userId: string, ipAddress: string, userAgent: string) {
    const token = this.jwtService.sign({ sub: userId });
    const refreshToken = this.jwtService.sign({ sub: userId }, { expiresIn: '7d' });

    const session = new this.sessionModel({
      userId,
      token,
      refreshToken,
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    return session.save();
  }

  private async recordFailedLoginAttempt(userId: string) {
    const attempt = new this.loginAttemptModel({
      userId,
      status: 'FAILED',
      attemptCount: 1,
    });
    await attempt.save();
  }

  private async recordSuccessfulLogin(userId: string, ipAddress: string) {
    await this.loginAttemptModel.deleteMany({ userId, status: 'FAILED' });
  }

  private async checkLoginAttempts(userId: string, ipAddress: string): Promise<boolean> {
    const recentAttempts = await this.loginAttemptModel.find({
      userId,
      status: 'FAILED',
      createdAt: { $gt: new Date(Date.now() - 15 * 60 * 1000) }, // Last 15 minutes
    });

    if (recentAttempts.length >= 5) {
      const blockDuration = 30 * 60 * 1000; // 30 minutes
      await this.loginAttemptModel.create({
        userId,
        status: 'BLOCKED',
        blockedUntil: new Date(Date.now() + blockDuration),
      });
      return true;
    }

    return false;
  }

  private async verifyTwoFactorCode(twoFactor: TwoFactorAuth, code: string): Promise<boolean> {
    // Implementation depends on the 2FA method
    // This is a placeholder for the actual verification logic
    return true;
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