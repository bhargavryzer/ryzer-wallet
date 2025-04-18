import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export type UserPreferencesDocument = UserPreferences & Document;
export type UserActivityDocument = UserActivity & Document;

export enum ActivityType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  TWO_FACTOR_CHANGE = 'TWO_FACTOR_CHANGE',
  WALLET_CREATE = 'WALLET_CREATE',
  WALLET_DELETE = 'WALLET_DELETE',
  TRANSACTION_CREATE = 'TRANSACTION_CREATE',
  TRANSACTION_UPDATE = 'TRANSACTION_UPDATE',
  SETTINGS_UPDATE = 'SETTINGS_UPDATE'
}

@Schema({ timestamps: true })
export class UserPreferences {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop()
  language: string;

  @Prop()
  timezone: string;

  @Prop()
  currency: string;

  @Prop()
  theme: string;

  @Prop()
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    transaction: boolean;
    security: boolean;
    marketing: boolean;
  };

  @Prop()
  security: {
    sessionTimeout: number;
    requirePasswordChange: number;
    loginNotifications: boolean;
    deviceManagement: boolean;
  };

  @Prop()
  display: {
    showBalance: boolean;
    showTransactionHistory: boolean;
    defaultView: string;
  };

  @Prop()
  privacy: {
    profileVisibility: string;
    activityVisibility: string;
    searchVisibility: string;
  };
}

@Schema({ timestamps: true })
export class UserActivity {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: String, enum: ActivityType, required: true })
  type: ActivityType;

  @Prop({ required: true })
  description: string;

  @Prop()
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
  metadata: {
    oldValue: any;
    newValue: any;
    affectedId: string;
  };
}

export const UserPreferencesSchema = SchemaFactory.createForClass(UserPreferences);
export const UserActivitySchema = SchemaFactory.createForClass(UserActivity); 