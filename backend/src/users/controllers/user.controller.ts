import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Permission } from '../schemas/role.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UpdateSettingsDto } from '../dto/update-settings.dto';
import { User } from '../schemas/user.schema';
import { UserActivity } from '../schemas/user-activity.schema';

@ApiTags('User Management')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Permission.USER_CREATE)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: User })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully', type: User })
  async getProfile(@Req() req): Promise<User> {
    return this.userService.getUserById(req.user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully', type: User })
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto): Promise<User> {
    return this.userService.updateProfile(req.user.id, updateProfileDto);
  }

  @Put('settings')
  @ApiOperation({ summary: 'Update user settings' })
  @ApiResponse({ status: 200, description: 'Settings updated successfully', type: User })
  async updateSettings(@Req() req, @Body() updateSettingsDto: UpdateSettingsDto): Promise<User> {
    return this.userService.updateSettings(req.user.id, updateSettingsDto);
  }

  @Put('password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  async changePassword(@Req() req, @Body() changePasswordDto: ChangePasswordDto): Promise<void> {
    return this.userService.changePassword(req.user.id, changePasswordDto);
  }

  @Post('2fa/enable')
  @ApiOperation({ summary: 'Enable two-factor authentication' })
  @ApiResponse({ status: 200, description: '2FA enabled successfully' })
  async enableTwoFactor(@Req() req): Promise<{ secret: string; qrCode: string }> {
    return this.userService.enableTwoFactor(req.user.id);
  }

  @Post('2fa/disable')
  @ApiOperation({ summary: 'Disable two-factor authentication' })
  @ApiResponse({ status: 200, description: '2FA disabled successfully' })
  async disableTwoFactor(@Req() req, @Body('code') code: string): Promise<void> {
    return this.userService.disableTwoFactor(req.user.id, code);
  }

  @Post('passkeys')
  @ApiOperation({ summary: 'Register a new passkey' })
  @ApiResponse({ status: 201, description: 'Passkey registered successfully' })
  async registerPasskey(@Req() req, @Body('credential') credential: any): Promise<void> {
    return this.userService.registerPasskey(req.user.id, credential);
  }

  @Delete('passkeys/:credentialId')
  @ApiOperation({ summary: 'Remove a passkey' })
  @ApiResponse({ status: 200, description: 'Passkey removed successfully' })
  async removePasskey(@Req() req, @Param('credentialId') credentialId: string): Promise<void> {
    return this.userService.removePasskey(req.user.id, credentialId);
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get user activity history' })
  @ApiResponse({ status: 200, description: 'Activity history retrieved successfully', type: [UserActivity] })
  async getActivity(
    @Req() req,
    @Body('options') options: {
      limit?: number;
      offset?: number;
      type?: string;
    },
  ): Promise<{ activities: UserActivity[]; total: number }> {
    return this.userService.getUserActivity(req.user.id, options);
  }

  @Put(':userId/role')
  @Roles(Permission.USER_UPDATE)
  @ApiOperation({ summary: 'Update user role' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 404, description: 'User or role not found' })
  async updateRole(
    @Param('userId') userId: string,
    @Body('roleId') roleId: string,
  ) {
    return this.userService.updateRole(userId, roleId);
  }

  @Post('oauth/:provider')
  @ApiOperation({ summary: 'Connect OAuth provider' })
  @ApiResponse({ status: 200, description: 'OAuth connection successful' })
  async connectOAuth(
    @Req() req,
    @Param('provider') provider: string,
    @Body() data: any,
  ) {
    return this.userService.connectOAuth(req.user.sub, provider, data);
  }

  @Post('oauth/:provider/disconnect')
  @ApiOperation({ summary: 'Disconnect OAuth provider' })
  @ApiResponse({ status: 200, description: 'OAuth disconnected successfully' })
  async disconnectOAuth(
    @Req() req,
    @Param('provider') provider: string,
  ) {
    return this.userService.disconnectOAuth(req.user.sub, provider);
  }

  @Get('search')
  @Roles(Permission.USER_READ)
  @ApiOperation({ summary: 'Search users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async searchUsers(
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.userService.searchUsers({ search, role, status, limit, offset });
  }

  @Get('export')
  @ApiOperation({ summary: 'Export user data' })
  @ApiResponse({ status: 200, description: 'User data exported successfully' })
  async exportUserData(@Req() req) {
    return this.userService.exportUserData(req.user.sub);
  }
} 