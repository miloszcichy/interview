import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TableContentItem } from '../model/table-content-item.model';
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
  contentTableItems: TableContentItem[];
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
    this.getTableContent();
  }

  /*1.Using userApi.getCurrentUser() fetch user and assign it to the field user.*/
  private getUser() {}
  /*2.Using userApi.getCurrentUser() and permissionsApi.getPermissions() create new observable "hasPermission".
      To check whether a user has permission to display content you need both values from userApi=User and permissionsApi=UserPermissions.
      Next you need to call userPermissions.hasPermission(userId, Permission.DISPLAY_CONTENT): boolean.
  */
  private getUserPermission() {}
  /*3.
    -Fetch Content[] from contentApi.
    -Decode "location" and "department" using decodeService.instant(code: number): Observable<string>
    -Map Content[] to TableContentItem[]:
      TableContentItem class contains two fields: id, description.
      To create TableContentItem.description use pattern "Entry: content.description, Department: content.department, Location: content.location"
    -Assign the result to fields tableContentItems */
  private getTableContent() {}
}
