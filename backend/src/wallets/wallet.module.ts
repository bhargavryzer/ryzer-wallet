import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletService } from './services/wallet.service';
import { WalletController } from './controllers/wallet.controller';
import { Wallet, WalletSchema } from './schemas/wallet.schema';
import { EOAWallet, EOAWalletSchema } from './schemas/eoa-wallet.schema';
import { ContractWallet, ContractWalletSchema } from './schemas/contract-wallet.schema';
import { MPCWallet, MPCWalletSchema } from './schemas/mpc-wallet.schema';
import { WalletTransaction, WalletTransactionSchema } from './schemas/wallet-transaction.schema';
import { WalletNotification, WalletNotificationSchema } from './schemas/wallet-notification.schema';
import { WalletGuardian, WalletGuardianSchema } from './schemas/wallet-guardian.schema';
import { WalletRecovery, WalletRecoverySchema } from './schemas/wallet-recovery.schema';
import { AddressBook, AddressBookSchema } from './schemas/address-book.schema';
import { TransactionService } from './services/transaction.service';
import { NotificationService } from './services/notification.service';
import { GuardianService } from './services/guardian.service';
import { RecoveryService } from './services/recovery.service';
import { AddressBookService } from './services/address-book.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
      { name: EOAWallet.name, schema: EOAWalletSchema },
      { name: ContractWallet.name, schema: ContractWalletSchema },
      { name: MPCWallet.name, schema: MPCWalletSchema },
      { name: WalletTransaction.name, schema: WalletTransactionSchema },
      { name: WalletNotification.name, schema: WalletNotificationSchema },
      { name: WalletGuardian.name, schema: WalletGuardianSchema },
      { name: WalletRecovery.name, schema: WalletRecoverySchema },
      { name: AddressBook.name, schema: AddressBookSchema },
    ]),
  ],
  controllers: [WalletController],
  providers: [
    WalletService,
    TransactionService,
    NotificationService,
    GuardianService,
    RecoveryService,
    AddressBookService,
  ],
  exports: [
    WalletService,
    TransactionService,
    NotificationService,
    GuardianService,
    RecoveryService,
    AddressBookService,
  ],
})
export class WalletModule {} 