import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'john.doe@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiProperty({ example: '0x123...', required: false })
  @IsOptional()
  @IsString()
  walletAddress?: string;

  @ApiProperty({ example: 'en', required: false })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ example: 'UTC', required: false })
  @IsOptional()
  @IsString()
  timezone?: string;

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
} 