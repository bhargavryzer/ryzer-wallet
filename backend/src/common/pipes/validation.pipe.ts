import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { isEthereumAddress } from 'class-validator';
import { OAuthProvider } from '../../users/schemas/oauth.schema';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const errorMessages = errors.map(error => ({
        property: error.property,
        constraints: error.constraints,
      }));
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    // Additional custom validations
    if (object.email) {
      this.validateEmail(object.email);
    }

    if (object.password) {
      this.validatePassword(object.password);
    }

    if (object.walletAddress) {
      this.validateWalletAddress(object.walletAddress);
    }

    if (object.provider) {
      this.validateOAuthProvider(object.provider);
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }
  }

  private validatePassword(password: string): void {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }

    if (!hasUpperCase) {
      throw new BadRequestException('Password must contain at least one uppercase letter');
    }

    if (!hasLowerCase) {
      throw new BadRequestException('Password must contain at least one lowercase letter');
    }

    if (!hasNumbers) {
      throw new BadRequestException('Password must contain at least one number');
    }

    if (!hasSpecialChar) {
      throw new BadRequestException('Password must contain at least one special character');
    }
  }

  private validateWalletAddress(address: string): void {
    if (!isEthereumAddress(address)) {
      throw new BadRequestException('Invalid Ethereum wallet address');
    }
  }

  private validateOAuthProvider(provider: string): void {
    if (!Object.values(OAuthProvider).includes(provider as OAuthProvider)) {
      throw new BadRequestException('Invalid OAuth provider');
    }
  }
} 