import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AddressBook } from '../schemas/address-book.schema';
import { CreateAddressBookEntryDto } from '../dto/create-address-book-entry.dto';
import { WalletService } from './wallet.service';
import { NotificationService } from './notification.service';

@Injectable()
export class AddressBookService {
  constructor(
    @InjectModel(AddressBook.name) private addressBookModel: Model<AddressBook>,
    private walletService: WalletService,
    private notificationService: NotificationService,
  ) {}

  async createAddressBookEntry(
    userId: string,
    createAddressBookEntryDto: CreateAddressBookEntryDto,
  ): Promise<AddressBook> {
    const { walletId, name, address, label, description, tags, currency, network, metadata } =
      createAddressBookEntryDto;

    // Verify wallet exists and belongs to user
    const wallet = await this.walletService.getWalletById(walletId);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Check if address already exists in address book
    const existingEntry = await this.addressBookModel.findOne({
      walletId: new Types.ObjectId(walletId),
      address,
    });
    if (existingEntry) {
      throw new BadRequestException('Address already exists in address book');
    }

    // Create address book entry
    const entry = await this.addressBookModel.create({
      walletId: new Types.ObjectId(walletId),
      userId: new Types.ObjectId(userId),
      name,
      address,
      label,
      description,
      tags,
      currency,
      network,
      metadata,
      verificationStatus: 'pending',
    });

    // Create notification
    await this.notificationService.createSecurityNotification(
      walletId,
      userId,
      'New Address Added',
      `A new address (${name || address}) has been added to your address book.`,
      { addressBookId: entry._id },
    );

    return entry;
  }

  async getAddressBookEntryById(id: string): Promise<AddressBook> {
    const entry = await this.addressBookModel.findById(id);
    if (!entry) {
      throw new NotFoundException('Address book entry not found');
    }
    return entry;
  }

  async getAddressBookEntriesByWalletId(walletId: string): Promise<AddressBook[]> {
    return this.addressBookModel.find({ walletId: new Types.ObjectId(walletId) });
  }

  async updateAddressBookEntry(
    id: string,
    updateData: Partial<AddressBook>,
  ): Promise<AddressBook> {
    const entry = await this.addressBookModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );
    if (!entry) {
      throw new NotFoundException('Address book entry not found');
    }
    return entry;
  }

  async deleteAddressBookEntry(id: string): Promise<void> {
    const result = await this.addressBookModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Address book entry not found');
    }
  }

  async verifyAddress(id: string): Promise<AddressBook> {
    const entry = await this.addressBookModel.findByIdAndUpdate(
      id,
      { $set: { verificationStatus: 'verified' } },
      { new: true },
    );
    if (!entry) {
      throw new NotFoundException('Address book entry not found');
    }
    return entry;
  }

  async getAddressBookEntryByAddress(walletId: string, address: string): Promise<AddressBook> {
    const entry = await this.addressBookModel.findOne({
      walletId: new Types.ObjectId(walletId),
      address,
    });
    if (!entry) {
      throw new NotFoundException('Address book entry not found');
    }
    return entry;
  }

  async shareAddressBookEntry(
    id: string,
    sharedWith: string[],
    permissions: string[],
  ): Promise<AddressBook> {
    const entry = await this.addressBookModel.findByIdAndUpdate(
      id,
      {
        $set: {
          'sharing.sharedWith': sharedWith,
          'sharing.permissions': permissions,
        },
      },
      { new: true },
    );
    if (!entry) {
      throw new NotFoundException('Address book entry not found');
    }
    return entry;
  }

  async searchAddressBookEntries(
    walletId: string,
    searchTerm: string,
  ): Promise<AddressBook[]> {
    return this.addressBookModel.find({
      walletId: new Types.ObjectId(walletId),
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { address: { $regex: searchTerm, $options: 'i' } },
        { label: { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [searchTerm] } },
      ],
    });
  }
} 