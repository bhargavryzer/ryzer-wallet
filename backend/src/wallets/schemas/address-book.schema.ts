import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type AddressBookDocument = AddressBook & Document;

@Schema({ timestamps: true })
export class AddressBook {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop()
  label: string;

  @Prop()
  description: string;

  @Prop()
  tags: string[];

  @Prop()
  currency: string;

  @Prop()
  network: string;

  @Prop()
  metadata: {
    isFavorite: boolean;
    lastUsed: Date;
    usageCount: number;
    notes: string;
  };

  @Prop()
  verificationStatus: {
    isVerified: boolean;
    verifiedAt: Date;
    verifiedBy: string;
  };

  @Prop()
  sharing: {
    isShared: boolean;
    sharedWith: {
      userId: string;
      permissions: string[];
    }[];
  };
} 