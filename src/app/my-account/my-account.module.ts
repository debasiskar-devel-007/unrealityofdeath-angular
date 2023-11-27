import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyAccountRoutingModule } from './my-account-routing.module';
import { AccountInfoComponent } from './account-info/account-info.component';


@NgModule({
  declarations: [
    // AccountInfoComponent
  ],
  imports: [
    CommonModule,
    MyAccountRoutingModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class MyAccountModule { }
