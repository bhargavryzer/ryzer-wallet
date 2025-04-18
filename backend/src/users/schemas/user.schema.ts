import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  walletAddress: string;

  @Prop({ type: String, ref: 'Role' })
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastLoginAt: Date;

  @Prop()
  lastLoginIp: string;

  @Prop()
  twoFactorEnabled: boolean;

  @Prop()
  twoFactorSecret: string;

  @Prop()
  passkeyCredentials: {
    id: string;
    publicKey: string;
    algorithm: string;
    counter: number;
  }[];

  @Prop()
  metadata: {
    language: string;
    timezone: string;
    theme: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
}

export const UserSchema = SchemaFactory.createForClass(User); 