import { EPermission } from '@domain/enums/EPermission';
import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: EPermission[]) =>
	SetMetadata(PERMISSIONS_KEY, permissions);
