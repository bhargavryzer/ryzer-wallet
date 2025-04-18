import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export type OAuthDocument = OAuth & Document;

export enum OAuthProvider {
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  TWITTER = 'TWITTER',
  GITHUB = 'GITHUB',
  LINKEDIN = 'LINKEDIN',
  APPLE = 'APPLE'
}

export enum OAuthStatus {
  ACTIVE = 'ACTIVE',
  REVOKED = 'REVOKED',
  EXPIRED = 'EXPIRED'
}

@Schema({ timestamps: true })
export class OAuth {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: String, enum: OAuthProvider, required: true })
  provider: OAuthProvider;

  @Prop({ required: true })
  providerId: string;

  @Prop()
  accessToken: string;

  @Prop()
  refreshToken: string;

  @Prop()
  tokenExpiresAt: Date;

  @Prop({ type: String, enum: OAuthStatus, default: OAuthStatus.ACTIVE })
  status: OAuthStatus;

  @Prop()
  scopes: string[];

  @Prop()
  profile: {
    email: string;
    name: string;
    picture: string;
    locale: string;
    verified: boolean;
  };

  @Prop()
  metadata: {
    lastUsed: Date;
    lastSynced: Date;
    connectedAt: Date;
    disconnectedAt: Date;
  };

  @Prop()
  settings: {
    autoSync: boolean;
    syncInterval: number;
    permissions: string[];
  };
}

export const OAuthSchema = SchemaFactory.createForClass(OAuth); 