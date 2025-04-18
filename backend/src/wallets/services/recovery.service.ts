import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WalletRecovery, RecoveryStatus } from '../schemas/wallet-recovery.schema';
import { CreateRecoveryDto } from '../dto/create-recovery.dto';
import { WalletService } from './wallet.service';
import { GuardianService } from './guardian.service';
import { NotificationService } from './notification.service';

@Injectable()
export class RecoveryService {
  constructor(
    @InjectModel(WalletRecovery.name) private recoveryModel: Model<WalletRecovery>,
    private walletService: WalletService,
    private guardianService: GuardianService,
    private notificationService: NotificationService,
  ) {}

  async initiateRecovery(createRecoveryDto: CreateRecoveryDto): Promise<WalletRecovery> {
    const { walletId, userId, newOwner, requiredConfirmations, recoveryDelay } = createRecoveryDto;

    // Verify wallet exists
    const wallet = await this.walletService.getWalletById(walletId);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Check for existing recovery process
    const existingRecovery = await this.recoveryModel.findOne({
      walletId: new Types.ObjectId(walletId),
      status: { $in: [RecoveryStatus.INITIATED, RecoveryStatus.CONFIRMED] },
    });
    if (existingRecovery) {
      throw new BadRequestException('Recovery process already in progress');
    }

    // Create recovery process
    const recovery = await this.recoveryModel.create({
      walletId: new Types.ObjectId(walletId),
      userId: new Types.ObjectId(userId),
      recoveryId: this.generateRecoveryId(),
      status: RecoveryStatus.INITIATED,
      newOwner,
      guardianConfirmations: [],
      confirmationCount: 0,
      requiredConfirmations,
      recoveryDelay,
      initiatedAt: new Date(),
      expiresAt: new Date(Date.now() + recoveryDelay * 1000),
    });

    // Notify guardians
    const guardians = await this.guardianService.getGuardiansByWalletId(walletId);
    for (const guardian of guardians) {
      await this.notificationService.createRecoveryNotification(
        walletId,
        guardian.userId.toString(),
        'Wallet Recovery Initiated',
        `A recovery process has been initiated for wallet ${wallet.address}. Please confirm if this is legitimate.`,
        { recoveryId: recovery.recoveryId },
      );
    }

    return recovery;
  }

  async confirmRecovery(recoveryId: string, guardianAddress: string): Promise<WalletRecovery> {
    const recovery = await this.recoveryModel.findOne({ recoveryId });
    if (!recovery) {
      throw new NotFoundException('Recovery process not found');
    }

    // Verify guardian
    const guardian = await this.guardianService.getGuardianByAddress(
      recovery.walletId.toString(),
      guardianAddress,
    );

    if (recovery.guardianConfirmations.includes(guardianAddress)) {
      throw new BadRequestException('Guardian has already confirmed this recovery');
    }

    // Add confirmation
    recovery.guardianConfirmations.push(guardianAddress);
    recovery.confirmationCount = recovery.guardianConfirmations.length;

    // Check if recovery can be executed
    if (recovery.confirmationCount >= recovery.requiredConfirmations) {
      recovery.status = RecoveryStatus.CONFIRMED;
    }

    await recovery.save();

    // Notify wallet owner
    await this.notificationService.createRecoveryNotification(
      recovery.walletId.toString(),
      recovery.userId.toString(),
      'Recovery Confirmed',
      `Guardian ${guardian.name || guardian.address} has confirmed the recovery process.`,
      { recoveryId: recovery.recoveryId },
    );

    return recovery;
  }

  async executeRecovery(recoveryId: string): Promise<WalletRecovery> {
    const recovery = await this.recoveryModel.findOne({ recoveryId });
    if (!recovery) {
      throw new NotFoundException('Recovery process not found');
    }

    if (recovery.status !== RecoveryStatus.CONFIRMED) {
      throw new BadRequestException('Recovery process not confirmed');
    }

    if (new Date() < recovery.expiresAt) {
      throw new BadRequestException('Recovery delay period not elapsed');
    }

    // Execute recovery
    const wallet = await this.walletService.getWalletById(recovery.walletId.toString());
    await this.walletService.updateWallet(wallet._id.toString(), {
      userId: new Types.ObjectId(recovery.newOwner),
    });

    recovery.status = RecoveryStatus.EXECUTED;
    await recovery.save();

    // Notify all parties
    await this.notificationService.createRecoveryNotification(
      recovery.walletId.toString(),
      recovery.userId.toString(),
      'Recovery Executed',
      'The wallet recovery process has been completed successfully.',
      { recoveryId: recovery.recoveryId },
    );

    return recovery;
  }

  async cancelRecovery(recoveryId: string): Promise<WalletRecovery> {
    const recovery = await this.recoveryModel.findOneAndUpdate(
      { recoveryId },
      { $set: { status: RecoveryStatus.EXPIRED } },
      { new: true },
    );
    if (!recovery) {
      throw new NotFoundException('Recovery process not found');
    }

    // Notify all parties
    await this.notificationService.createRecoveryNotification(
      recovery.walletId.toString(),
      recovery.userId.toString(),
      'Recovery Cancelled',
      'The wallet recovery process has been cancelled.',
      { recoveryId: recovery.recoveryId },
    );

    return recovery;
  }

  async getRecoveryById(id: string): Promise<WalletRecovery> {
    const recovery = await this.recoveryModel.findById(id);
    if (!recovery) {
      throw new NotFoundException('Recovery process not found');
    }
    return recovery;
  }

  async getRecoveriesByWalletId(walletId: string): Promise<WalletRecovery[]> {
    return this.recoveryModel.find({ walletId: new Types.ObjectId(walletId) });
  }

  private generateRecoveryId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
} 