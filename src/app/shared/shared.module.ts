import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/layout/header/header.component';
import { FooterComponent } from 'src/app/layout/footer/footer.component';
import { ListingAngular15Module } from 'listing-angular15';
import { ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../material/material.module';
import { LastLoginInfoComponent } from '../Common-components/last-login-info/last-login-info.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LastLoginInfoComponent,

  ],
  imports: [
    CommonModule,
    ListingAngular15Module,
    DemoMaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    ListingAngular15Module,
    DemoMaterialModule,
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
    CommonModule,
    LastLoginInfoComponent,
    
    
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA]
})
export class SharedModule { }