import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ClickReportComponent } from './click-report/click-report.component';
import { ConversionReportComponent } from './conversion-report/conversion-report.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ClickReportComponent,
    ConversionReportComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule,
  ]
})
export class ReportModule { }
