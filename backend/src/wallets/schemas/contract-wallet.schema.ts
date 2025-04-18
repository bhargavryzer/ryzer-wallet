import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Wallet, WalletSchema } from './wallet.schema';

export type ContractWalletDocument = ContractWallet & Document;

@Schema()
export class ContractWallet extends Wallet {
  @Prop({ required: true })
  implementation: string;

  @Prop({ type: Object })
  configuration: {
    threshold?: number;
    owners?: string[];
    requiredSignatures?: number;
    dailyLimit?: number;
    transactionLimit?: number;
  };

  @Prop({ type: Object })
  security: {
    upgradeDelay?: number;
    upgradeNonce?: number;
    lastUpgrade?: Date;
    allowedUpgraders?: string[];
  };

  @Prop({ type: Object })
  modules: {
    recovery?: string;
    socialRecovery?: string;
    multiSig?: string;
    spendingLimit?: string;
  };
}

export const ContractWalletSchema = SchemaFactory.createForClass(ContractWallet); 