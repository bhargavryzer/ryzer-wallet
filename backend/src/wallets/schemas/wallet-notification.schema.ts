import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Wallet } from './wallet.schema';

export type WalletNotificationDocument = WalletNotification & Document;

export enum NotificationType {
  TRANSACTION = 'transaction',
  SECURITY = 'security',
  RECOVERY = 'recovery',
  SYSTEM = 'system',
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
}

@Schema({ timestamps: true })
export class WalletNotification {
  @Prop({ type: Types.ObjectId, ref: 'Wallet', required: true })
  walletId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;

  @Prop({ required: true, enum: NotificationStatus, default: NotificationStatus.UNREAD })
  status: NotificationStatus;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Object })
  metadata: {
    transactionHash?: string;
    amount?: string;
    currency?: string;
    from?: string;
    to?: string;
    securityLevel?: string;
    actionRequired?: boolean;
    priority?: number;
  };

  @Prop({ type: Date })
  readAt: Date;

  @Prop({ type: Date })
  archivedAt: Date;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const WalletNotificationSchema = SchemaFactory.createForClass(WalletNotification); 