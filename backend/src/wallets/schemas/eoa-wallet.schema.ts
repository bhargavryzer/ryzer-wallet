import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Wallet, WalletSchema } from './wallet.schema';

export type EOAWalletDocument = EOAWallet & Document;

@Schema()
export class EOAWallet extends Wallet {
  @Prop({ required: true })
  privateKey: string;

  @Prop({ type: String })
  mnemonic: string;

  @Prop({ type: Object })
  security: {
    encryptionKey?: string;
    lastKeyRotation?: Date;
    nextKeyRotation?: Date;
    allowedIPs?: string[];
    allowedDevices?: string[];
  };

  @Prop({ type: Object })
  backup: {
    encryptedPrivateKey?: string;
    backupLocation?: string;
    lastBackup?: Date;
    backupStatus?: string;
  };
}

export const EOAWalletSchema = SchemaFactory.createForClass(EOAWallet); 