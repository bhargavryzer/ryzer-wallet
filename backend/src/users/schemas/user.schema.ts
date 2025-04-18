import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  walletAddress: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: false })
  isPhoneVerified: boolean;

  @Prop()
  lastLoginAt: Date;

  @Prop()
  twoFactorSecret: string;

  @Prop({ default: false })
  isTwoFactorEnabled: boolean;

  @Prop()
  profilePicture: string;

  @Prop()
  country: string;

  @Prop()
  language: string;

  @Prop()
  timezone: string;

  @Prop()
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    security: {
      loginAlerts: boolean;
      transactionAlerts: boolean;
    };
  };
}

export const UserSchema = SchemaFactory.createForClass(User); 