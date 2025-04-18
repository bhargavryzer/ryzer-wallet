import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WalletTransaction, TransactionStatus, TransactionType } from '../schemas/wallet-transaction.schema';
import { WalletService } from './wallet.service';
import { ethers } from 'ethers';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(WalletTransaction.name) private transactionModel: Model<WalletTransaction>,
    private walletService: WalletService,
  ) {}

  async createTransaction(userId: string, createTransactionDto: CreateTransactionDto): Promise<WalletTransaction> {
    const { walletId, type, to, amount, currency, metadata } = createTransactionDto;

    // Get the wallet
    const wallet = await this.walletService.getWalletById(walletId);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Create transaction record
    const transaction = await this.transactionModel.create({
      walletId: new Types.ObjectId(walletId),
      userId: new Types.ObjectId(userId),
      type,
      status: TransactionStatus.PENDING,
      from: wallet.address,
      to,
      amount,
      currency,
      metadata,
      executedAt: new Date(),
    });

    try {
      // Execute transaction based on wallet type
      switch (wallet.type) {
        case 'EOA':
          await this.executeEOATransaction(wallet, transaction);
          break;
        case 'CONTRACT':
          await this.executeContractTransaction(wallet, transaction);
          break;
        case 'MPC':
          await this.executeMPCTransaction(wallet, transaction);
          break;
        default:
          throw new BadRequestException('Invalid wallet type');
      }

      // Update transaction status
      transaction.status = TransactionStatus.COMPLETED;
      transaction.completedAt = new Date();
      await transaction.save();

      return transaction;
    } catch (error) {
      // Update transaction status on failure
      transaction.status = TransactionStatus.FAILED;
      transaction.metadata.error = error.message;
      await transaction.save();
      throw error;
    }
  }

  private async executeEOATransaction(wallet: any, transaction: WalletTransaction): Promise<void> {
    // Implement EOA transaction execution
    // This is a placeholder - implement actual transaction execution
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(wallet.privateKey, provider);
    
    const tx = await signer.sendTransaction({
      to: transaction.to,
      value: ethers.utils.parseEther(transaction.amount),
    });

    transaction.hash = tx.hash;
    transaction.gasPrice = tx.gasPrice.toString();
    transaction.gasUsed = tx.gasLimit.toString();
  }

  private async executeContractTransaction(wallet: any, transaction: WalletTransaction): Promise<void> {
    // Implement contract transaction execution
    // This is a placeholder - implement actual contract interaction
    throw new Error('Contract transaction execution not implemented');
  }

  private async executeMPCTransaction(wallet: any, transaction: WalletTransaction): Promise<void> {
    // Implement MPC transaction execution
    // This is a placeholder - implement actual MPC transaction
    throw new Error('MPC transaction execution not implemented');
  }

  async getTransactionById(id: string): Promise<WalletTransaction> {
    const transaction = await this.transactionModel.findById(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  async getTransactionsByWalletId(walletId: string): Promise<WalletTransaction[]> {
    return this.transactionModel.find({ walletId: new Types.ObjectId(walletId) });
  }

  async getTransactionsByUserId(userId: string): Promise<WalletTransaction[]> {
    return this.transactionModel.find({ userId: new Types.ObjectId(userId) });
  }

  async cancelTransaction(id: string): Promise<WalletTransaction> {
    const transaction = await this.transactionModel.findByIdAndUpdate(
      id,
      { $set: { status: TransactionStatus.CANCELLED } },
      { new: true },
    );
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }
} 