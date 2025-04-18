import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Role, RoleSchema } from './schemas/role.schema';
import { UserActivity, UserActivitySchema } from './schemas/user-activity.schema';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { OAuthService } from './services/oauth.service';
import { OAuthController } from './controllers/oauth.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: UserActivity.name, schema: UserActivitySchema },
    ]),
  ],
  controllers: [UserController, OAuthController],
  providers: [UserService, OAuthService],
  exports: [UserService, OAuthService],
})
export class UsersModule {} 