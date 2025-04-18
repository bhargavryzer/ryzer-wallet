import { SetMetadata } from '@nestjs/common';
import { Permission } from '../schemas/role.schema';

export const Roles = (...permissions: Permission[]) =>
  SetMetadata('permissions', permissions); 