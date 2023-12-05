import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LastLoginInfoComponent } from './Common-components/last-login-info/last-login-info.component';
import { PreviewComponent } from './Common-components/preview/preview.component';
import { ComingsoonComponent } from './Common-components/comingsoon/comingsoon.component';
import { AccountInfoComponent } from './my-account/account-info/account-info.component';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { SharerMethod } from 'ngx-sharebuttons';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LastLoginInfoComponent,
    PreviewComponent,
    ComingsoonComponent,
    AccountInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    ShareButtonsModule.withConfig({
      debug: true,
      sharerMethod: SharerMethod.Window
    }),
    ShareIconsModule,
  ],
  providers: [AuthGuardService,AuthService],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule { }
