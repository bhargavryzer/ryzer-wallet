import { IsString, IsOptional, IsObject, IsEnum } from 'class-validator';
import { WalletStatus } from '../schemas/wallet.schema';

export class UpdateWalletDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsEnum(WalletStatus)
  status?: WalletStatus;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsObject()
  security?: {
    allowedIPs?: string[];
    allowedDevices?: string[];
    lastKeyRotation?: Date;
    nextKeyRotation?: Date;
  };
} 