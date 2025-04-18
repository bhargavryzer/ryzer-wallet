import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Wallet, WalletSchema } from './wallet.schema';

export type MPCWalletDocument = MPCWallet & Document;

@Schema()
export class MPCWallet extends Wallet {
  @Prop({ required: true })
  threshold: string;

  @Prop({ required: true, default: false })
  mainGroupCreated: boolean;

  @Prop({ type: Object })
  keyShares: {
    publicKey: string;
    encryptedShares: string[];
    threshold: number;
    totalShares: number;
  };

  @Prop({ type: Object })
  recovery: {
    backupShares: string[];
    recoveryThreshold: number;
    recoveryTotalShares: number;
  };

  @Prop({ type: Object })
  security: {
    allowedIPs: string[];
    allowedDevices: string[];
    lastKeyRotation: Date;
    nextKeyRotation: Date;
  };
}

export const MPCWalletSchema = SchemaFactory.createForClass(MPCWallet); 