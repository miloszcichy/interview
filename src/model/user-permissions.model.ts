import { Permission } from './permission.enum';

export class UserPermissions {
  hasPermission(userId: number, permission: Permission) {
    return userId === 1 && permission === Permission.DISPLAY_CONTENT;
  }
}
