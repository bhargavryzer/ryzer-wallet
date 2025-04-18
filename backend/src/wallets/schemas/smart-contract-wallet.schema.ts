import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Wallet, WalletSchema } from './wallet.schema';

export type SmartContractWalletDocument = SmartContractWallet & Document;

export enum SmartContractWalletType {
  SAFE = 'safe',
  AA = 'aa',
}

@Schema()
export class SmartContractWallet extends Wallet {
  @Prop({ required: true, enum: SmartContractWalletType })
  contractType: SmartContractWalletType;

  @Prop({ required: true })
  address: string;

  @Prop({ type: Object })
  implementation: {
    version: string;
    factoryAddress: string;
    entryPointAddress: string;
    paymasterAddress?: string;
  };

  @Prop({ type: Object })
  security: {
    guardians: string[];
    threshold: number;
    recoveryDelay: number;
    allowedIPs: string[];
    allowedDevices: string[];
  };

  @Prop({ type: Object })
  modules: {
    name: string;
    address: string;
    enabled: boolean;
    config: Record<string, any>;
  }[];

  @Prop({ type: Object })
  transactions: {
    hash: string;
    status: string;
    timestamp: Date;
    type: string;
    data: Record<string, any>;
  }[];
}

export const SmartContractWalletSchema = SchemaFactory.createForClass(SmartContractWallet); 