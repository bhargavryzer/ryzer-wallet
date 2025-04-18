import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { WalletService } from '../services/wallet.service';
import { Wallet } from '../schemas/wallet.schema';
import { CreateWalletInput } from '../dto/create-wallet.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/schemas/user.schema';

@Resolver(() => Wallet)
export class WalletResolver {
  constructor(private readonly walletService: WalletService) {}

  @Mutation(() => Wallet)
  @UseGuards(GqlAuthGuard)
  async createWallet(
    @Args('createWalletInput') createWalletInput: CreateWalletInput,
    @CurrentUser() user: User,
  ) {
    return this.walletService.create({
      ...createWalletInput,
      userId: user._id,
    });
  }

  @Query(() => [Wallet])
  @UseGuards(GqlAuthGuard)
  async myWallets(@CurrentUser() user: User) {
    return this.walletService.findByUserId(user._id);
  }

  @Query(() => Wallet)
  @UseGuards(GqlAuthGuard)
  async wallet(@Args('address') address: string) {
    return this.walletService.findByAddress(address);
  }

  @Mutation(() => Wallet)
  @UseGuards(GqlAuthGuard)
  async verifyWallet(@Args('address') address: string) {
    return this.walletService.verifyWallet(address);
  }

  @Query(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async validateWalletAddress(@Args('address') address: string) {
    return this.walletService.validateAddress(address);
  }

  @Query(() => Number)
  @UseGuards(GqlAuthGuard)
  async walletBalance(@Args('address') address: string) {
    return this.walletService.getBalance(address);
  }
} 