import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Wallet } from './wallet.schema';

export type WalletSettingsDocument = WalletSettings & Document;

@Schema({ timestamps: true })
export class WalletSettings {
  @Prop({ type: Types.ObjectId, ref: 'Wallet', required: true })
  walletId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Object })
  notifications: {
    email: boolean;
    push: boolean;
    transactionAlerts: boolean;
    securityAlerts: boolean;
    marketing: boolean;
  };

  @Prop({ type: Object })
  security: {
    twoFactorEnabled: boolean;
    biometricEnabled: boolean;
    autoLock: boolean;
    lockTimeout: number;
    allowedIPs: string[];
    allowedDevices: string[];
  };

  @Prop({ type: Object })
  display: {
    currency: string;
    language: string;
    theme: string;
    hideBalances: boolean;
    showTestnets: boolean;
  };

  @Prop({ type: Object })
  transactions: {
    defaultGasLimit: number;
    defaultGasPrice: number;
    autoApprove: boolean;
    maxTransactionAmount: number;
    whitelistedAddresses: string[];
  };

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const WalletSettingsSchema = SchemaFactory.createForClass(WalletSettings); 