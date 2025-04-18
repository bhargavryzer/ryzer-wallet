import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WalletNotification, NotificationStatus } from '../schemas/wallet-notification.schema';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(WalletNotification.name) private notificationModel: Model<WalletNotification>,
  ) {}

  async createNotification(createNotificationDto: CreateNotificationDto): Promise<WalletNotification> {
    const { walletId, userId, type, title, message, metadata } = createNotificationDto;

    return this.notificationModel.create({
      walletId: new Types.ObjectId(walletId),
      userId: new Types.ObjectId(userId),
      type,
      status: NotificationStatus.UNREAD,
      title,
      message,
      metadata,
    });
  }

  async getNotificationById(id: string): Promise<WalletNotification> {
    const notification = await this.notificationModel.findById(id);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async getNotificationsByWalletId(walletId: string): Promise<WalletNotification[]> {
    return this.notificationModel.find({ walletId: new Types.ObjectId(walletId) });
  }

  async getNotificationsByUserId(userId: string): Promise<WalletNotification[]> {
    return this.notificationModel.find({ userId: new Types.ObjectId(userId) });
  }

  async markAsRead(id: string): Promise<WalletNotification> {
    const notification = await this.notificationModel.findByIdAndUpdate(
      id,
      { 
        $set: { 
          status: NotificationStatus.READ,
          readAt: new Date(),
        } 
      },
      { new: true },
    );
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async markAsArchived(id: string): Promise<WalletNotification> {
    const notification = await this.notificationModel.findByIdAndUpdate(
      id,
      { 
        $set: { 
          status: NotificationStatus.ARCHIVED,
          archivedAt: new Date(),
        } 
      },
      { new: true },
    );
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async deleteNotification(id: string): Promise<void> {
    const result = await this.notificationModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Notification not found');
    }
  }

  async createTransactionNotification(
    walletId: string,
    userId: string,
    transaction: any,
  ): Promise<WalletNotification> {
    return this.createNotification({
      walletId,
      userId,
      type: 'transaction',
      title: 'New Transaction',
      message: `Transaction ${transaction.status}: ${transaction.amount} ${transaction.currency}`,
      metadata: {
        transactionHash: transaction.hash,
        amount: transaction.amount,
        currency: transaction.currency,
        from: transaction.from,
        to: transaction.to,
      },
    });
  }

  async createSecurityNotification(
    walletId: string,
    userId: string,
    title: string,
    message: string,
    metadata: any = {},
  ): Promise<WalletNotification> {
    return this.createNotification({
      walletId,
      userId,
      type: 'security',
      title,
      message,
      metadata: {
        ...metadata,
        securityLevel: 'high',
        actionRequired: true,
      },
    });
  }

  async createRecoveryNotification(
    walletId: string,
    userId: string,
    title: string,
    message: string,
    metadata: any = {},
  ): Promise<WalletNotification> {
    return this.createNotification({
      walletId,
      userId,
      type: 'recovery',
      title,
      message,
      metadata: {
        ...metadata,
        actionRequired: true,
        priority: 1,
      },
    });
  }
} 