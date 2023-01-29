import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app/app.component';
import { UserApi } from './service/user/user.api';
import { PermissionsApi } from './service/permissions/permissions.api';
import { ContentApi } from './service/content/content.api';
import { DecodeService } from './service/decode/decode.service';


@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent],
  bootstrap:    [ AppComponent],
  providers: [UserApi, PermissionsApi, ContentApi, DecodeService]
})
export class AppModule { }
