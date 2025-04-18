import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OAuthService } from '../services/oauth.service';
import { OAuthProvider } from '../schemas/oauth.schema';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Response } from 'express';

@ApiTags('OAuth')
@Controller('oauth')
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  @Get('callback/:provider')
  @ApiOperation({ summary: 'Handle OAuth callback' })
  @ApiResponse({ status: 200, description: 'OAuth callback handled successfully' })
  @ApiResponse({ status: 400, description: 'Invalid provider or code' })
  async handleCallback(
    @Query('code') code: string,
    @Query('provider') provider: OAuthProvider,
    @Res() res: Response,
  ) {
    try {
      const result = await this.oauthService.handleOAuthCallback(provider, code);
      
      // Redirect to frontend with token and user data
      const redirectUrl = `${process.env.FRONTEND_URL}/oauth/callback?token=${result.token}&isNewUser=${result.user.isNewUser}`;
      res.redirect(redirectUrl);
    } catch (error) {
      // Redirect to frontend with error
      const redirectUrl = `${process.env.FRONTEND_URL}/oauth/callback?error=${encodeURIComponent(error.message)}`;
      res.redirect(redirectUrl);
    }
  }

  @Get('providers')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get available OAuth providers' })
  @ApiResponse({ status: 200, description: 'List of available providers' })
  getProviders() {
    return {
      providers: Object.values(OAuthProvider).map(provider => ({
        name: provider,
        clientId: process.env[`${provider.toUpperCase()}_CLIENT_ID`],
        redirectUri: process.env[`${provider.toUpperCase()}_REDIRECT_URI`],
        authUrl: this.getAuthUrl(provider),
      })),
    };
  }

  private getAuthUrl(provider: OAuthProvider): string {
    const config = {
      [OAuthProvider.GOOGLE]: 'https://accounts.google.com/o/oauth2/v2/auth',
      [OAuthProvider.FACEBOOK]: 'https://www.facebook.com/v12.0/dialog/oauth',
      [OAuthProvider.GITHUB]: 'https://github.com/login/oauth/authorize',
    }[provider];

    const params = new URLSearchParams({
      client_id: process.env[`${provider.toUpperCase()}_CLIENT_ID`],
      redirect_uri: process.env[`${provider.toUpperCase()}_REDIRECT_URI`],
      response_type: 'code',
      scope: this.getScopes(provider),
      state: Math.random().toString(36).substring(7), // Random state for security
    });

    return `${config}?${params.toString()}`;
  }

  private getScopes(provider: OAuthProvider): string {
    const scopes = {
      [OAuthProvider.GOOGLE]: 'email profile',
      [OAuthProvider.FACEBOOK]: 'email public_profile',
      [OAuthProvider.GITHUB]: 'user:email',
    }[provider];

    return scopes;
  }
} 