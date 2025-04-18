import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Wallet } from './wallet.schema';

export type WalletRecoveryDocument = WalletRecovery & Document;

export enum RecoveryStatus {
  INITIATED = 'initiated',
  CONFIRMED = 'confirmed',
  EXECUTED = 'executed',
  EXPIRED = 'expired',
}

@Schema({ timestamps: true })
export class WalletRecovery {
  @Prop({ type: Types.ObjectId, ref: 'Wallet', required: true })
  walletId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  recoveryId: string;

  @Prop({ required: true, enum: RecoveryStatus })
  status: RecoveryStatus;

  @Prop({ type: String })
  newOwner: string;

  @Prop({ type: [String] })
  guardianConfirmations: string[];

  @Prop({ type: Number })
  confirmationCount: number;

  @Prop({ type: Number })
  requiredConfirmations: number;

  @Prop({ type: Number })
  recoveryDelay: number;

  @Prop({ type: Date })
  initiatedAt: Date;

  @Prop({ type: Date })
  expiresAt: Date;

  @Prop({ type: Object })
  metadata: {
    signatures?: string[];
    oldOwners?: string[];
    newOwners?: string[];
    threshold?: number;
    error?: string;
  };

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const WalletRecoverySchema = SchemaFactory.createForClass(WalletRecovery); 