import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WalletGuardian, GuardianStatus } from '../schemas/wallet-guardian.schema';
import { CreateGuardianDto } from '../dto/create-guardian.dto';
import { WalletService } from './wallet.service';
import { NotificationService } from './notification.service';

@Injectable()
export class GuardianService {
  constructor(
    @InjectModel(WalletGuardian.name) private guardianModel: Model<WalletGuardian>,
    private walletService: WalletService,
    private notificationService: NotificationService,
  ) {}

  async addGuardian(userId: string, createGuardianDto: CreateGuardianDto): Promise<WalletGuardian> {
    const { walletId, address, name, email, phone, weight, metadata } = createGuardianDto;

    // Verify wallet exists and belongs to user
    const wallet = await this.walletService.getWalletById(walletId);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Check if guardian already exists
    const existingGuardian = await this.guardianModel.findOne({
      walletId: new Types.ObjectId(walletId),
      address,
    });
    if (existingGuardian) {
      throw new BadRequestException('Guardian already exists for this wallet');
    }

    // Create guardian
    const guardian = await this.guardianModel.create({
      walletId: new Types.ObjectId(walletId),
      userId: new Types.ObjectId(userId),
      address,
      status: GuardianStatus.PENDING,
      name,
      email,
      phone,
      weight,
      metadata,
      addedAt: new Date(),
    });

    // Create notification for wallet owner
    await this.notificationService.createSecurityNotification(
      walletId,
      userId,
      'New Guardian Added',
      `A new guardian (${name || address}) has been added to your wallet.`,
      { guardianId: guardian._id },
    );

    return guardian;
  }

  async getGuardianById(id: string): Promise<WalletGuardian> {
    const guardian = await this.guardianModel.findById(id);
    if (!guardian) {
      throw new NotFoundException('Guardian not found');
    }
    return guardian;
  }

  async getGuardiansByWalletId(walletId: string): Promise<WalletGuardian[]> {
    return this.guardianModel.find({ walletId: new Types.ObjectId(walletId) });
  }

  async activateGuardian(id: string): Promise<WalletGuardian> {
    const guardian = await this.guardianModel.findByIdAndUpdate(
      id,
      { $set: { status: GuardianStatus.ACTIVE } },
      { new: true },
    );
    if (!guardian) {
      throw new NotFoundException('Guardian not found');
    }

    // Create notification
    await this.notificationService.createSecurityNotification(
      guardian.walletId.toString(),
      guardian.userId.toString(),
      'Guardian Activated',
      `Guardian ${guardian.name || guardian.address} has been activated.`,
      { guardianId: guardian._id },
    );

    return guardian;
  }

  async revokeGuardian(id: string): Promise<WalletGuardian> {
    const guardian = await this.guardianModel.findByIdAndUpdate(
      id,
      { 
        $set: { 
          status: GuardianStatus.REVOKED,
          revokedAt: new Date(),
        } 
      },
      { new: true },
    );
    if (!guardian) {
      throw new NotFoundException('Guardian not found');
    }

    // Create notification
    await this.notificationService.createSecurityNotification(
      guardian.walletId.toString(),
      guardian.userId.toString(),
      'Guardian Revoked',
      `Guardian ${guardian.name || guardian.address} has been revoked.`,
      { guardianId: guardian._id },
    );

    return guardian;
  }

  async updateGuardian(id: string, updateData: Partial<WalletGuardian>): Promise<WalletGuardian> {
    const guardian = await this.guardianModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );
    if (!guardian) {
      throw new NotFoundException('Guardian not found');
    }
    return guardian;
  }

  async verifyGuardianThreshold(walletId: string, requiredWeight: number): Promise<boolean> {
    const activeGuardians = await this.guardianModel.find({
      walletId: new Types.ObjectId(walletId),
      status: GuardianStatus.ACTIVE,
    });

    const totalWeight = activeGuardians.reduce((sum, guardian) => sum + (guardian.weight || 1), 0);
    return totalWeight >= requiredWeight;
  }

  async getGuardianByAddress(walletId: string, address: string): Promise<WalletGuardian> {
    const guardian = await this.guardianModel.findOne({
      walletId: new Types.ObjectId(walletId),
      address,
    });
    if (!guardian) {
      throw new NotFoundException('Guardian not found');
    }
    return guardian;
  }
} 