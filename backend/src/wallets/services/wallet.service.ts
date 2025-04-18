import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet, WalletDocument } from '../schemas/wallet.schema';
import { CreateWalletInput } from '../dto/create-wallet.input';
import { Web3 } from 'web3';

@Injectable()
export class WalletService {
  private web3: Web3;

  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
  ) {
    this.web3 = new Web3();
  }

  async create(createWalletInput: CreateWalletInput): Promise<Wallet> {
    const account = this.web3.eth.accounts.create();
    const wallet = new this.walletModel({
      ...createWalletInput,
      address: account.address,
    });
    return wallet.save();
  }

  async findByUserId(userId: string): Promise<Wallet[]> {
    return this.walletModel.find({ userId }).exec();
  }

  async findByAddress(address: string): Promise<Wallet> {
    return this.walletModel.findOne({ address }).exec();
  }

  async updateBalance(address: string, amount: number): Promise<Wallet> {
    return this.walletModel
      .findOneAndUpdate(
        { address },
        { $inc: { balance: amount } },
        { new: true },
      )
      .exec();
  }

  async verifyWallet(address: string): Promise<Wallet> {
    return this.walletModel
      .findOneAndUpdate(
        { address },
        { isVerified: true },
        { new: true },
      )
      .exec();
  }

  async validateAddress(address: string): Promise<boolean> {
    return this.web3.utils.isAddress(address);
  }

  async getBalance(address: string): Promise<number> {
    const wallet = await this.walletModel.findOne({ address }).exec();
    return wallet ? wallet.balance : 0;
  }
} 