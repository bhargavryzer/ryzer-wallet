import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

export enum Permission {
  // User Management
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  USER_EXPORT = 'user:export',
  
  // Wallet Management
  WALLET_CREATE = 'wallet:create',
  WALLET_READ = 'wallet:read',
  WALLET_UPDATE = 'wallet:update',
  WALLET_DELETE = 'wallet:delete',
  WALLET_TRANSFER = 'wallet:transfer',
  
  // Transaction Management
  TRANSACTION_CREATE = 'transaction:create',
  TRANSACTION_READ = 'transaction:read',
  TRANSACTION_UPDATE = 'transaction:update',
  TRANSACTION_DELETE = 'transaction:delete',
  
  // Address Book
  ADDRESS_CREATE = 'address:create',
  ADDRESS_READ = 'address:read',
  ADDRESS_UPDATE = 'address:update',
  ADDRESS_DELETE = 'address:delete',
  
  // Settings
  SETTINGS_READ = 'settings:read',
  SETTINGS_UPDATE = 'settings:update',
  
  // Admin
  ADMIN_ALL = 'admin:all'
}

export enum RoleType {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
  READ_ONLY = 'READ_ONLY'
}

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: String, enum: RoleType, required: true })
  type: RoleType;

  @Prop({ type: [String], enum: Permission, required: true })
  permissions: Permission[];

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  metadata: {
    createdBy: string;
    lastModifiedBy: string;
    notes: string;
  };
}

export const RoleSchema = SchemaFactory.createForClass(Role); 