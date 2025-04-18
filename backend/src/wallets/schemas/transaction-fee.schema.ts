import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type TransactionFeeDocument = TransactionFee & Document;

export enum FeePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CUSTOM = 'custom'
}

@Schema({ timestamps: true })
export class TransactionFee {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true })
  network: string;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  priority: FeePriority;

  @Prop({ required: true })
  baseFee: number;

  @Prop()
  gasLimit: number;

  @Prop()
  gasPrice: number;

  @Prop()
  maxFeePerGas: number;

  @Prop()
  maxPriorityFeePerGas: number;

  @Prop()
  estimatedTime: number; // in minutes

  @Prop()
  metadata: {
    lastUpdated: Date;
    source: string;
    confidence: number;
    historicalData: {
      timestamp: Date;
      fee: number;
    }[];
  };

  @Prop()
  customSettings: {
    isEnabled: boolean;
    maxFee: number;
    minFee: number;
    preferredPriority: FeePriority;
  };
} 