import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserActivityDocument = UserActivity & Document;

export enum ActivityType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  TWO_FACTOR_ENABLE = 'TWO_FACTOR_ENABLE',
  TWO_FACTOR_DISABLE = 'TWO_FACTOR_DISABLE',
  WALLET_CONNECT = 'WALLET_CONNECT',
  WALLET_DISCONNECT = 'WALLET_DISCONNECT',
  OAUTH_CONNECT = 'OAUTH_CONNECT',
  OAUTH_DISCONNECT = 'OAUTH_DISCONNECT',
  PASSKEY_REGISTER = 'PASSKEY_REGISTER',
  PASSKEY_REMOVE = 'PASSKEY_REMOVE',
  SETTINGS_UPDATE = 'SETTINGS_UPDATE',
}

@Schema({ timestamps: true })
export class UserActivity {
  @Prop({ required: true, type: String, ref: 'User' })
  userId: string;

  @Prop({ required: true, enum: ActivityType })
  type: ActivityType;

  @Prop({ required: true })
  description: string;

  @Prop()
  ipAddress: string;

  @Prop()
  userAgent: string;

  @Prop()
  metadata: {
    [key: string]: any;
  };
}

export const UserActivitySchema = SchemaFactory.createForClass(UserActivity); 