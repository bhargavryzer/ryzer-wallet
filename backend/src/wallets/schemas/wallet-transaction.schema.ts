import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Wallet } from './wallet.schema';

export type WalletTransactionDocument = WalletTransaction & Document;

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum TransactionType {
  TRANSFER = 'transfer',
  SWAP = 'swap',
  STAKE = 'stake',
  UNSTAKE = 'unstake',
  CONTRACT_INTERACTION = 'contract_interaction',
}

@Schema({ timestamps: true })
export class WalletTransaction {
  @Prop({ type: Types.ObjectId, ref: 'Wallet', required: true })
  walletId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  hash: string;

  @Prop({ required: true, enum: TransactionType })
  type: TransactionType;

  @Prop({ required: true, enum: TransactionStatus })
  status: TransactionStatus;

  @Prop({ type: String })
  from: string;

  @Prop({ type: String })
  to: string;

  @Prop({ type: String })
  amount: string;

  @Prop({ type: String })
  currency: string;

  @Prop({ type: Number })
  nonce: number;

  @Prop({ type: String })
  gasPrice: string;

  @Prop({ type: String })
  gasUsed: string;

  @Prop({ type: Object })
  metadata: {
    contractAddress?: string;
    method?: string;
    parameters?: any;
    error?: string;
    confirmations?: number;
    blockNumber?: number;
  };

  @Prop({ type: Date })
  executedAt: Date;

  @Prop({ type: Date })
  completedAt: Date;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const WalletTransactionSchema = SchemaFactory.createForClass(WalletTransaction); 