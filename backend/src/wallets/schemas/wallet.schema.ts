import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type WalletDocument = Wallet & Document;

export enum WalletType {
  MPC = 'mpc',
  CUSTODIAL = 'custodial',
  SMART_CONTRACT = 'smart_contract',
}

export enum WalletStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  FROZEN = 'frozen',
}

@Schema({ timestamps: true, discriminatorKey: 'type' })
export class Wallet {
  @Prop({ required: true, enum: WalletType })
  type: WalletType;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: WalletStatus, default: WalletStatus.PENDING })
  status: WalletStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  userEmail: string;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet); 