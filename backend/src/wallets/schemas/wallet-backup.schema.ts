import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Wallet } from './wallet.schema';
import { User } from '../../users/schemas/user.schema';

export type WalletBackupDocument = WalletBackup & Document;

export enum BackupType {
  FULL = 'FULL',
  PARTIAL = 'PARTIAL',
  KEY_ONLY = 'KEY_ONLY',
}

export enum BackupStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  VERIFIED = 'VERIFIED',
}

@Schema({ timestamps: true })
export class WalletBackup {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Wallet', required: true })
  walletId: Wallet;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: String, enum: BackupType, required: true })
  type: BackupType;

  @Prop({ type: String, enum: BackupStatus, default: BackupStatus.PENDING })
  status: BackupStatus;

  @Prop()
  backupData: {
    privateKey?: string;
    mnemonic?: string;
    publicKey?: string;
    address?: string;
    metadata?: any;
  };

  @Prop()
  encryptionKey: string;

  @Prop()
  backupLocation: string;

  @Prop()
  verificationHash: string;

  @Prop()
  lastVerifiedAt: Date;

  @Prop()
  metadata: {
    device: string;
    ipAddress: string;
    location: {
      country: string;
      city: string;
    };
    notes: string;
  };

  @Prop()
  recoveryInstructions: string;

  @Prop()
  expiresAt: Date;
} 