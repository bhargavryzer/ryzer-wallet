import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export type TwoFactorAuthDocument = TwoFactorAuth & Document;

export enum TwoFactorMethod {
  AUTHENTICATOR = 'AUTHENTICATOR',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  BACKUP_CODE = 'BACKUP_CODE'
}

export enum TwoFactorStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
  PENDING = 'PENDING'
}

@Schema({ timestamps: true })
export class TwoFactorAuth {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: String, enum: TwoFactorMethod, required: true })
  method: TwoFactorMethod;

  @Prop({ type: String, enum: TwoFactorStatus, default: TwoFactorStatus.DISABLED })
  status: TwoFactorStatus;

  @Prop()
  secret: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  email: string;

  @Prop()
  backupCodes: {
    code: string;
    used: boolean;
    usedAt: Date;
  }[];

  @Prop()
  lastUsed: Date;

  @Prop()
  metadata: {
    setupDate: Date;
    lastChanged: Date;
    recoveryEmail: string;
    recoveryPhone: string;
  };

  @Prop()
  settings: {
    requireOnLogin: boolean;
    requireOnTransaction: boolean;
    requireOnSettingsChange: boolean;
    trustedDevices: {
      deviceId: string;
      lastUsed: Date;
      name: string;
    }[];
  };
}

export const TwoFactorAuthSchema = SchemaFactory.createForClass(TwoFactorAuth); 