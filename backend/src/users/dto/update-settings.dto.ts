import { IsBoolean, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSettingsDto {
  @ApiProperty({ example: 'light', required: false })
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  twoFactorEnabled?: boolean;

  @ApiProperty({ example: { email: true, push: true, sms: false }, required: false })
  @IsOptional()
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  showBalance?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  showTransactionHistory?: boolean;

  @ApiProperty({ example: 'dashboard', required: false })
  @IsOptional()
  @IsString()
  defaultView?: string;
} 