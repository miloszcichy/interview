import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { Content } from '../model/content.model';
import { User } from '../model/user.model';
import { ContentApi } from '../service/content/content.api';
import { DecodeService } from '../service/decode/decode.service';
import { PermissionsApi } from '../service/permissions/permissions.api';
import { UserApi } from '../service/user/user.api';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  user: User = {} as User;
  content: Content[] = [] as Content[];
  hasPermission$: Observable<boolean>;
  private onDestroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private userApi: UserApi,
    private contentApi: ContentApi,
    private permissionsApi: PermissionsApi,
    private decodeService: DecodeService
  ) {}

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.getUser();
    this.getUserPermission();
    this.contentApi.getContent().subscribe((value) => (this.content = value));
  }

  /*1. Using userApi.getCurrentUser() fetch user and assign it to the field user.*/
  private getUser() {
    this.userApi
      .getCurrentUser()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => (this.user = value));
  }
  /*2. using userApi.getCurrentUser() and permissionsApi.getPermissions()
      create new observable "hasPermission".
  */
  private getUserPermission() {
    combineLatest([this.userApi.getCurrentUser(), this.permissionsApi.getPermissions()])
  }
}
