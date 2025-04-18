import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type WalletDocument = Wallet & Document;

export enum WalletType {
  HOT = 'HOT',
  COLD = 'COLD',
  MULTISIG = 'MULTISIG',
  CUSTODIAL = 'CUSTODIAL',
}

export enum WalletStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
  PENDING = 'PENDING',
}

@Schema({ timestamps: true })
export class Wallet {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true, unique: true })
  address: string;

  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop({ required: true, default: 'ETH' })
  currency: string;

  @Prop({ type: String, enum: WalletType, default: WalletType.HOT })
  type: WalletType;

  @Prop({ type: String, enum: WalletStatus, default: WalletStatus.ACTIVE })
  status: WalletStatus;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  privateKey: string;

  @Prop()
  publicKey: string;

  @Prop()
  mnemonic: string;

  @Prop({ default: false })
  isBackedUp: boolean;

  @Prop()
  lastBackupAt: Date;

  @Prop()
  backupLocation: string;

  @Prop()
  securitySettings: {
    twoFactorEnabled: boolean;
    withdrawalLimit: number;
    dailyLimit: number;
    allowedIPs: string[];
    allowedDevices: string[];
  };

  @Prop()
  metadata: {
    name: string;
    description: string;
    tags: string[];
    customFields: Record<string, any>;
  };

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Transaction' }] })
  transactions: string[];

  @Prop()
  lastActivityAt: Date;

  @Prop()
  lastBalanceUpdate: Date;
} 