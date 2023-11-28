import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AffiliateDasboardRoutingModule } from './affiliate-dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { CampaignmodalComponent } from './campaignmodal/campaignmodal.component';
import { DashboardReportModalComponent } from './dashboard-report-modal/dashboard-report-modal.component';
import { ReportListComponent } from './dashboard-report-modal/report-list/report-list.component';



@NgModule({
  declarations: [
    DashboardComponent,
    CampaignmodalComponent,
    DashboardReportModalComponent,
    ReportListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AffiliateDasboardRoutingModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AffiliateDashboardModule { }
