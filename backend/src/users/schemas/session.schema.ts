import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export type SessionDocument = Session & Document;

export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED'
}

export enum LoginAttemptStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  BLOCKED = 'BLOCKED'
}

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ type: String, enum: SessionStatus, default: SessionStatus.ACTIVE })
  status: SessionStatus;

  @Prop({ required: true })
  ipAddress: string;

  @Prop()
  userAgent: string;

  @Prop()
  deviceInfo: {
    type: string;
    os: string;
    browser: string;
    deviceId: string;
  };

  @Prop()
  location: {
    country: string;
    city: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };

  @Prop({ default: Date.now })
  lastActivity: Date;

  @Prop()
  expiresAt: Date;
}

@Schema({ timestamps: true })
export class LoginAttempt {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: String, enum: LoginAttemptStatus, required: true })
  status: LoginAttemptStatus;

  @Prop({ required: true })
  ipAddress: string;

  @Prop()
  userAgent: string;

  @Prop()
  deviceInfo: {
    type: string;
    os: string;
    browser: string;
    deviceId: string;
  };

  @Prop()
  location: {
    country: string;
    city: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };

  @Prop()
  failureReason: string;

  @Prop({ default: 0 })
  attemptCount: number;

  @Prop()
  blockedUntil: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
export const LoginAttemptSchema = SchemaFactory.createForClass(LoginAttempt); 