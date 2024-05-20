import { SetMetadata } from '@nestjs/common';
import { userRole } from 'src/enum/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: userRole[]) => SetMetadata(ROLES_KEY, roles);
