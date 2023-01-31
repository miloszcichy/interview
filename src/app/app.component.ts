import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, mergeMap, mergeAll, toArray } from 'rxjs/operators';
import { TableContentItem } from '../model/table-content-item.model';
import { User } from '../model/user.model';
import { ContentApi } from '../service/content/content.api';
import { DecodeService } from '../service/decode/decode.service';
import { PermissionsApi } from '../service/permissions/permissions.api';
import { UserApi } from '../service/user/user.api';
import { Permission } from '../model/permission.enum';

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

  /*1.Using UserApi#getCurrentUser() fetch user and assign it to the field user.*/
  private getUser() {
    this.userApi.getCurrentUser().subscribe((user) => (this.user = user));
  }
  /*2.Using UserApi#getCurrentUser() and PermissionsApi#getPermissions() create new observable "hasPermission".
      To check whether a user has permission to display content you need both values from UserApi=User and PermissionsApi=UserPermissions.
      Next you need to call UserPermissions#hasPermission(userId, Permission.DISPLAY_CONTENT): boolean.
  */
  private getUserPermission() {
    const id$ = this.userApi.getCurrentUser().pipe(map((u) => u.id));
    this.hasPermission$ = this.permissionsApi
      .getPermissions()
      .pipe(
        mergeMap((userPermission) =>
          id$.pipe(
            map((id) =>
              userPermission.hasPermission(id, Permission.DISPLAY_CONTENT)
            )
          )
        )
      );
  }
  /*3.
    -Fetch Content[] from contentApi.
    -Decode "Content#location" and "Content#department" using DecodeService#instant(code: number): Observable<string>
    -Map Content[] to TableContentItem[]:
      TableContentItem class contains two fields: id, description.
      To create TableContentItem#description use pattern "Entry: Content#description, Department: decoded_Department, Location: decoded_Location"
    -Assign the result to fields tableContentItems */
  private getTableContent() {
    this.contentApi
      .getContent()
      .pipe(
        mergeAll(),
        map(
          (content) =>
            <TableContentItem>{
              id: content.id,
              description:
                'Entry: ' +
                content.description +
                ', Department ' +
                this.decodeService.instant(content.department).subscribe() +
                ', Location: ' +
                this.decodeService.instant(content.location).subscribe(),
            }
        ),
        toArray()
      )
      .subscribe(
        (contentTableItems) => (this.contentTableItems = contentTableItems)
      );
  }
}
