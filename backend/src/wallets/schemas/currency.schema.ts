import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CurrencyDocument = Currency & Document;

export enum CurrencyType {
  CRYPTO = 'CRYPTO',
  FIAT = 'FIAT',
  TOKEN = 'TOKEN',
}

@Schema({ timestamps: true })
export class Currency {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  symbol: string;

  @Prop({ type: String, enum: CurrencyType, required: true })
  type: CurrencyType;

  @Prop()
  decimals: number;

  @Prop()
  contractAddress: string;

  @Prop()
  network: string;

  @Prop()
  icon: string;

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  exchangeRate: {
    usd: number;
    lastUpdated: Date;
  };

  @Prop()
  metadata: {
    website: string;
    explorer: string;
    documentation: string;
    social: {
      twitter: string;
      telegram: string;
      discord: string;
    };
  };
}

export const CurrencySchema = SchemaFactory.createForClass(Currency); 