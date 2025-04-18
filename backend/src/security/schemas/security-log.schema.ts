import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type SecurityLogDocument = SecurityLog & Document;

export enum SecurityEventType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  TWO_FACTOR_ENABLED = 'TWO_FACTOR_ENABLED',
  TWO_FACTOR_DISABLED = 'TWO_FACTOR_DISABLED',
  WALLET_CREATED = 'WALLET_CREATED',
  WALLET_DELETED = 'WALLET_DELETED',
  TRANSACTION = 'TRANSACTION',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  DEVICE_ADDED = 'DEVICE_ADDED',
  DEVICE_REMOVED = 'DEVICE_REMOVED',
  IP_BLOCKED = 'IP_BLOCKED',
  IP_ALLOWED = 'IP_ALLOWED',
}

export enum SecurityEventSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

@Schema({ timestamps: true })
export class SecurityLog {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true, enum: SecurityEventType })
  eventType: SecurityEventType;

  @Prop({ required: true, enum: SecurityEventSeverity })
  severity: SecurityEventSeverity;

  @Prop({ required: true })
  description: string;

  @Prop()
  ipAddress: string;

  @Prop()
  userAgent: string;

  @Prop()
  deviceId: string;

  @Prop()
  location: {
    country: string;
    city: string;
    latitude: number;
    longitude: number;
  };

  @Prop()
  metadata: Record<string, any>;

  @Prop({ default: false })
  requiresAction: boolean;

  @Prop()
  actionTaken: string;

  @Prop()
  actionTakenBy: string;

  @Prop()
  actionTakenAt: Date;
} 