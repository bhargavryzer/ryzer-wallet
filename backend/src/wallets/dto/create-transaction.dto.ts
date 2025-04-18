import { IsString, IsNumber, IsObject, IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType, TransactionStatus } from '../schemas/transaction.schema';

export class TransactionInputDto {
  @IsString()
  address: string;

  @IsString()
  amount: string;

  @IsOptional()
  @IsString()
  memo?: string;
}

export class TransactionOutputDto {
  @IsString()
  address: string;

  @IsString()
  amount: string;

  @IsOptional()
  @IsString()
  memo?: string;
}

export class CreateTransactionDto {
  @IsString()
  walletId: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsString()
  currency: string;

  @IsString()
  network: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionInputDto)
  inputs: TransactionInputDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionOutputDto)
  outputs: TransactionOutputDto[];

  @IsOptional()
  @IsNumber()
  fee?: number;

  @IsOptional()
  @IsString()
  memo?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;
} 