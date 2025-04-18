import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wallet, WalletType, WalletStatus } from '../schemas/wallet.schema';
import { EOAWallet } from '../schemas/eoa-wallet.schema';
import { ContractWallet } from '../schemas/contract-wallet.schema';
import { MPCWallet } from '../schemas/mpc-wallet.schema';
import { WalletDocument } from '../schemas/wallet.schema';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { UpdateWalletDto } from '../dto/update-wallet.dto';
import { ethers } from 'ethers';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    @InjectModel(EOAWallet.name) private eoaWalletModel: Model<EOAWallet>,
    @InjectModel(ContractWallet.name) private contractWalletModel: Model<ContractWallet>,
    @InjectModel(MPCWallet.name) private mpcWalletModel: Model<MPCWallet>,
  ) {}

  async createWallet(userId: string, createWalletDto: CreateWalletDto): Promise<WalletDocument> {
    const { type, name, description, tags } = createWalletDto;

    let wallet: WalletDocument;

    switch (type) {
      case WalletType.EOA:
        const wallet = ethers.Wallet.createRandom();
        wallet = await this.eoaWalletModel.create({
          userId: new Types.ObjectId(userId),
          type,
          status: WalletStatus.ACTIVE,
          address: wallet.address,
          name,
          description,
          tags,
          privateKey: wallet.privateKey,
          mnemonic: wallet.mnemonic.phrase,
        });
        break;

      case WalletType.CONTRACT:
        wallet = await this.contractWalletModel.create({
          userId: new Types.ObjectId(userId),
          type,
          status: WalletStatus.ACTIVE,
          address: createWalletDto.address,
          name,
          description,
          tags,
          implementation: createWalletDto.implementation,
          configuration: createWalletDto.configuration,
        });
        break;

      case WalletType.MPC:
        wallet = await this.mpcWalletModel.create({
          userId: new Types.ObjectId(userId),
          type,
          status: WalletStatus.ACTIVE,
          address: createWalletDto.address,
          name,
          description,
          tags,
          threshold: createWalletDto.threshold,
          keyShares: createWalletDto.keyShares,
        });
        break;

      default:
        throw new BadRequestException('Invalid wallet type');
    }

    return wallet;
  }

  async getWalletById(id: string): Promise<WalletDocument> {
    const wallet = await this.walletModel.findById(id);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet;
  }

  async getWalletsByUserId(userId: string): Promise<WalletDocument[]> {
    return this.walletModel.find({ userId: new Types.ObjectId(userId) });
  }

  async updateWallet(id: string, updateWalletDto: UpdateWalletDto): Promise<WalletDocument> {
    const wallet = await this.walletModel.findByIdAndUpdate(
      id,
      { $set: updateWalletDto },
      { new: true },
    );
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet;
  }

  async deleteWallet(id: string): Promise<void> {
    const result = await this.walletModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Wallet not found');
    }
  }

  async lockWallet(id: string): Promise<WalletDocument> {
    const wallet = await this.walletModel.findByIdAndUpdate(
      id,
      { $set: { status: WalletStatus.LOCKED } },
      { new: true },
    );
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet;
  }

  async unlockWallet(id: string): Promise<WalletDocument> {
    const wallet = await this.walletModel.findByIdAndUpdate(
      id,
      { $set: { status: WalletStatus.ACTIVE } },
      { new: true },
    );
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet;
  }

  async getWalletBalance(id: string): Promise<string> {
    const wallet = await this.getWalletById(id);
    // Implement balance fetching logic based on wallet type
    // This is a placeholder - implement actual balance fetching
    return '0';
  }
} 