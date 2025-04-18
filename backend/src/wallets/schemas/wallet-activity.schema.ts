import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Wallet } from './wallet.schema';

export type WalletActivityDocument = WalletActivity & Document;

export enum WalletActivityType {
  CREATED = 'created',
  UPDATED = 'updated',
  TRANSACTION = 'transaction',
  SECURITY = 'security',
  RECOVERY = 'recovery',
  APPROVAL = 'approval',
  FREEZE = 'freeze',
  UNFREEZE = 'unfreeze',
}

export enum WalletActivityStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending',
}

@Schema({ timestamps: true })
export class WalletActivity {
  @Prop({ type: Types.ObjectId, ref: 'Wallet', required: true })
  walletId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: WalletActivityType })
  type: WalletActivityType;

  @Prop({ required: true, enum: WalletActivityStatus })
  status: WalletActivityStatus;

  @Prop({ type: Object })
  metadata: {
    action: string;
    details: string;
    ipAddress?: string;
    deviceInfo?: string;
    transactionHash?: string;
    error?: string;
  };

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const WalletActivitySchema = SchemaFactory.createForClass(WalletActivity); 