import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Wallet } from './wallet.schema';

export type WalletGuardianDocument = WalletGuardian & Document;

export enum GuardianStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  REVOKED = 'revoked',
}

@Schema({ timestamps: true })
export class WalletGuardian {
  @Prop({ type: Types.ObjectId, ref: 'Wallet', required: true })
  walletId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, enum: GuardianStatus })
  status: GuardianStatus;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: Number })
  weight: number;

  @Prop({ type: Date })
  addedAt: Date;

  @Prop({ type: Date })
  revokedAt: Date;

  @Prop({ type: Object })
  metadata: {
    isPrimary?: boolean;
    isBackup?: boolean;
    verificationStatus?: string;
    lastActive?: Date;
    recoveryAttempts?: number;
  };

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const WalletGuardianSchema = SchemaFactory.createForClass(WalletGuardian); 