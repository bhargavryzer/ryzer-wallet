import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type DeviceDocument = Device & Document;

export enum DeviceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
}

export enum DeviceType {
  MOBILE = 'MOBILE',
  DESKTOP = 'DESKTOP',
  TABLET = 'TABLET',
  OTHER = 'OTHER',
}

@Schema({ timestamps: true })
export class Device {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String, enum: DeviceType, required: true })
  type: DeviceType;

  @Prop({ type: String, enum: DeviceStatus, default: DeviceStatus.ACTIVE })
  status: DeviceStatus;

  @Prop()
  lastLoginAt: Date;

  @Prop()
  lastActivityAt: Date;

  @Prop()
  ipAddress: string;

  @Prop()
  userAgent: string;

  @Prop()
  location: {
    country: string;
    city: string;
    latitude: number;
    longitude: number;
  };

  @Prop()
  fingerprint: string;

  @Prop()
  metadata: {
    os: string;
    browser: string;
    version: string;
    platform: string;
  };

  @Prop({ default: false })
  isTrusted: boolean;

  @Prop()
  trustedAt: Date;

  @Prop()
  trustedBy: string;
} 