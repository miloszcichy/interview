import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  combineLatest,
  firstValueFrom,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { Content } from '../model/content.model';
import { Permission } from '../model/permission.enum';
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
  private getUser() {
    this.userApi
      .getCurrentUser()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => (this.user = value));
  }
  /*2.Using userApi.getCurrentUser() AND permissionsApi.getPermissions() create new observable "hasPermission".
      To check whether a user has permission to display content you need both values from userApi and permissionsApi.
      Next you need to call userPermission.hasPermission(userId, Permission.DISPLAY_CONTENT): boolean.
  */
  private getUserPermission() {
    this.hasPermission$ = combineLatest([
      this.userApi.getCurrentUser(),
      this.permissionsApi.getPermissions(),
    ]).pipe(map(([user, permissions]) =>
        permissions.hasPermission(user.id, Permission.DISPLAY_CONTENT)
      )
    );
  }
  /*3.
    -Fetch Content[] from contentApi.
    -Decode "location" and "department" using decodeService.instant(code: number): Observable<string>
    -Map Content[] to TableContentItem[]:
      TableContentItem class contains two fields: id, description.
      To create TableContentItem.description use pattern "Entry: content.description, Department: content.department, Location: content.location"
    -Assign the result to fields tableContentItems */
  private getTableContent() {
    this.contentApi
      .getContent()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((contentList: Content[]) => {
        Promise.all(contentList.map(async (content) => {
            const department = await this.getDecodedValue(content.department);
            const location = await this.getDecodedValue(content.location);
            return this.buildContentTableItem(content, department, location);
          })).then((result) => (this.contentTableItems = result));
      });
  }

  private buildContentTableItem({ id, description }: Content, department, location) {
    return {
      id: id,
      description: `Entry: ${description}, Department: ${department}, Location: ${location}`,
    };
  }

  private async getDecodedValue(code: number): Promise<string> {
    return await firstValueFrom(this.decodeService.instant(code));
  }
}
