import { IsEnum, IsString, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WalletType } from '../schemas/wallet.schema';

export class CreateWalletDto {
  @IsEnum(WalletType)
  type: WalletType;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsString()
  threshold?: string;

  @IsOptional()
  @IsObject()
  keyShares?: {
    publicKey: string;
    encryptedShares: string[];
    threshold: number;
    totalShares: number;
  };

  @IsOptional()
  @IsObject()
  implementation?: {
    name: string;
    version: string;
    address: string;
  };

  @IsOptional()
  @IsObject()
  configuration?: Record<string, any>;
} 