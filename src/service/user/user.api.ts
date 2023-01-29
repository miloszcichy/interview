import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class UserApi {
  private user = { id: 1, firstName: 'Mark', lastName: 'Developer' };

  getCurrentUser() {
    return of(this.user);
  }
}
