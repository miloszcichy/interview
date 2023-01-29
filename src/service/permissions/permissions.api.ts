import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserPermissions } from '../../model/user-permissions.model';

@Injectable()
export class PermissionsApi {
  getPermissions(): Observable<UserPermissions> {
    return of(new UserPermissions());
  }
}
