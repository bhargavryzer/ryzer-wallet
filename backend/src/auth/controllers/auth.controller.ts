import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async loginEmail(@Req() req) {
    return this.authService.validateEmailPassword(req.user.email, req.user.password);
  }

  @Post('login/web3')
  @ApiOperation({ summary: 'Login with Web3 wallet' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid signature' })
  async loginWeb3(@Body() data: { address: string; signature: string; message: string }) {
    return this.authService.validateWeb3Wallet(data.address, data.signature, data.message);
  }

  @Post('login/guard')
  @ApiOperation({ summary: 'Login with Ryzer Guard' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Invalid code' })
  async loginGuard(@Body() data: { code: string }) {
    return this.authService.validateRyzerGuard(data.code);
  }

  @Post('login/passkey')
  @ApiOperation({ summary: 'Login with passkey' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Invalid credential' })
  async loginPasskey(@Body() data: { credential: any }) {
    return this.authService.validatePasskey(data.credential);
  }

  @Post('login/oauth/:provider')
  @ApiOperation({ summary: 'Login with OAuth provider' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Invalid provider or code' })
  async loginOAuth(@Body() data: { code: string }, @Req() req) {
    return this.authService.handleOAuthCallback(req.params.provider, data.code);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  async refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user);
  }
} 