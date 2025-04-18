import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { TwoFactorService } from '../services/two-factor.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Two-Factor Authentication')
@Controller('2fa')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TwoFactorController {
  constructor(private readonly twoFactorService: TwoFactorService) {}

  @Post('setup/authenticator')
  @ApiOperation({ summary: 'Setup authenticator-based 2FA' })
  @ApiResponse({ status: 200, description: '2FA setup initiated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async setupAuthenticator(@Req() req) {
    return this.twoFactorService.setupAuthenticator(req.user.sub);
  }

  @Post('verify/authenticator')
  @ApiOperation({ summary: 'Verify authenticator setup' })
  @ApiResponse({ status: 200, description: '2FA setup verified' })
  @ApiResponse({ status: 400, description: 'Invalid verification code' })
  async verifyAuthenticatorSetup(
    @Req() req,
    @Body() body: { code: string },
  ) {
    return this.twoFactorService.verifySetup(req.user.sub, body.code);
  }

  @Post('setup/sms')
  @ApiOperation({ summary: 'Setup SMS-based 2FA' })
  @ApiResponse({ status: 200, description: 'SMS verification code sent' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async setupSms(
    @Req() req,
    @Body() body: { phoneNumber: string },
  ) {
    return this.twoFactorService.setupSms(req.user.sub, body.phoneNumber);
  }

  @Post('verify/sms')
  @ApiOperation({ summary: 'Verify SMS setup' })
  @ApiResponse({ status: 200, description: 'SMS verification successful' })
  @ApiResponse({ status: 400, description: 'Invalid verification code' })
  async verifySmsSetup(
    @Req() req,
    @Body() body: { code: string },
  ) {
    return this.twoFactorService.verifySmsSetup(req.user.sub, body.code);
  }

  @Post('disable')
  @ApiOperation({ summary: 'Disable 2FA' })
  @ApiResponse({ status: 200, description: '2FA disabled successfully' })
  @ApiResponse({ status: 400, description: '2FA is not enabled' })
  async disableTwoFactor(@Req() req) {
    return this.twoFactorService.disableTwoFactor(req.user.sub);
  }

  @Post('backup-codes/generate')
  @ApiOperation({ summary: 'Generate new backup codes' })
  @ApiResponse({ status: 200, description: 'Backup codes generated' })
  @ApiResponse({ status: 400, description: '2FA is not enabled' })
  async generateBackupCodes(@Req() req) {
    return this.twoFactorService.generateBackupCodes(req.user.sub);
  }
} 