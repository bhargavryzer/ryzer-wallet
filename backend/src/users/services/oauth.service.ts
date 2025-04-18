import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OAuth, OAuthProvider, OAuthStatus } from '../schemas/oauth.schema';
import { User } from '../schemas/user.schema';
import { UserActivity, ActivityType } from '../schemas/user-preferences.schema';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

@Injectable()
export class OAuthService {
  constructor(
    @InjectModel('OAuth') private oauthModel: Model<OAuth>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('UserActivity') private activityModel: Model<UserActivity>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async handleOAuthCallback(provider: OAuthProvider, code: string) {
    const tokenData = await this.exchangeCodeForToken(provider, code);
    const userData = await this.getUserData(provider, tokenData.access_token);

    let user = await this.userModel.findOne({ email: userData.email });
    let isNewUser = false;

    if (!user) {
      // Create new user
      user = new this.userModel({
        email: userData.email,
        name: userData.name,
        // Set a random password that will never be used
        password: Math.random().toString(36).slice(-8),
      });
      await user.save();
      isNewUser = true;
    }

    // Connect OAuth account
    await this.oauthModel.findOneAndUpdate(
      { userId: user._id, provider },
      {
        providerId: userData.id,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        profile: {
          email: userData.email,
          name: userData.name,
          picture: userData.picture,
          locale: userData.locale,
          verified: userData.verified,
        },
        status: OAuthStatus.ACTIVE,
        metadata: {
          lastUsed: new Date(),
          connectedAt: new Date(),
        },
      },
      { upsert: true, new: true },
    );

    await this.recordActivity(
      user._id,
      ActivityType.PROFILE_UPDATE,
      `Connected ${provider} account`,
    );

    // Generate JWT token
    const token = this.jwtService.sign({ sub: user._id });

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isNewUser,
      },
    };
  }

  private async exchangeCodeForToken(provider: OAuthProvider, code: string) {
    const config = this.getProviderConfig(provider);

    const response = await axios.post(config.tokenUrl, {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code',
    });

    return response.data;
  }

  private async getUserData(provider: OAuthProvider, accessToken: string) {
    const config = this.getProviderConfig(provider);

    const response = await axios.get(config.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return this.normalizeUserData(provider, response.data);
  }

  private getProviderConfig(provider: OAuthProvider) {
    const config = {
      [OAuthProvider.GOOGLE]: {
        clientId: this.configService.get('GOOGLE_CLIENT_ID'),
        clientSecret: this.configService.get('GOOGLE_CLIENT_SECRET'),
        tokenUrl: 'https://oauth2.googleapis.com/token',
        userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
        redirectUri: this.configService.get('GOOGLE_REDIRECT_URI'),
      },
      [OAuthProvider.FACEBOOK]: {
        clientId: this.configService.get('FACEBOOK_CLIENT_ID'),
        clientSecret: this.configService.get('FACEBOOK_CLIENT_SECRET'),
        tokenUrl: 'https://graph.facebook.com/v12.0/oauth/access_token',
        userInfoUrl: 'https://graph.facebook.com/v12.0/me?fields=id,email,name,picture',
        redirectUri: this.configService.get('FACEBOOK_REDIRECT_URI'),
      },
      [OAuthProvider.GITHUB]: {
        clientId: this.configService.get('GITHUB_CLIENT_ID'),
        clientSecret: this.configService.get('GITHUB_CLIENT_SECRET'),
        tokenUrl: 'https://github.com/login/oauth/access_token',
        userInfoUrl: 'https://api.github.com/user',
        redirectUri: this.configService.get('GITHUB_REDIRECT_URI'),
      },
    }[provider];

    if (!config) {
      throw new BadRequestException('Invalid OAuth provider');
    }

    return config;
  }

  private normalizeUserData(provider: OAuthProvider, data: any) {
    const normalizers = {
      [OAuthProvider.GOOGLE]: (data) => ({
        id: data.sub,
        email: data.email,
        name: data.name,
        picture: data.picture,
        locale: data.locale,
        verified: data.email_verified,
      }),
      [OAuthProvider.FACEBOOK]: (data) => ({
        id: data.id,
        email: data.email,
        name: data.name,
        picture: data.picture?.data?.url,
        locale: data.locale,
        verified: true,
      }),
      [OAuthProvider.GITHUB]: (data) => ({
        id: data.id,
        email: data.email,
        name: data.name || data.login,
        picture: data.avatar_url,
        locale: null,
        verified: true,
      }),
    };

    return normalizers[provider](data);
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