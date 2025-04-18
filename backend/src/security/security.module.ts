import { Module } from '@nestjs/common';
import { SecurityService } from './services/security.service';
import { SecurityResolver } from './resolvers/security.resolver';
import { UsersModule } from '../users/users.module';
import { WalletsModule } from '../wallets/wallets.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SecurityLog, SecurityLogSchema } from './schemas/security-log.schema';
import { Device, DeviceSchema } from './schemas/device.schema';

@Module({
  imports: [
    UsersModule,
    WalletsModule,
    MongooseModule.forFeature([
      { name: SecurityLog.name, schema: SecurityLogSchema },
      { name: Device.name, schema: DeviceSchema },
    ]),
  ],
  providers: [SecurityService, SecurityResolver],
  exports: [SecurityService],
})
export class SecurityModule {} 