import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AffiliateDasboardRoutingModule } from './affiliate-dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { LastLoginInfoComponent } from '../Common-components/last-login-info/last-login-info.component';



@NgModule({
  declarations: [
    DashboardComponent,
    LastLoginInfoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AffiliateDasboardRoutingModule
  ]
})
export class AffiliateDashboardModule { }
