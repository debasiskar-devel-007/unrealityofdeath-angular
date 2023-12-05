import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClickReportComponent } from './click-report/click-report.component';
import { ConversionReportComponent } from './conversion-report/conversion-report.component';
import { ResolveService } from 'src/app/services/resolve.service';
import { CookieService } from 'ngx-cookie-service';

const routes: Routes = [
  {
    path: 'click-report',
    component: ClickReportComponent,
    resolve: { data: ResolveService },
    data: {
      requestcondition: {
        "condition": {
          "limit": 10,
          "skip": 0
      },
      "searchcondition": {
        
      },
      "sort": {
          "type": "desc",
          "field": "campaign_name"
      },
      "project": {},
      "token": ""
      },

      endpoint: 'click-conversion/click-list',
    },
   
  },
  {
    path: 'conversion-report',
    component: ConversionReportComponent,
    resolve: { data: ResolveService },
    data: {
      requestcondition: {
        "condition": {
          "limit": 10,
          "skip": 0
      },
      "searchcondition": {
        
      },
      "sort": {
          "type": "desc",
          "field": "campaign_name"
      },
      "project": {},
      "token": ""
      },

      endpoint: 'click-conversion/click-list',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {
  constructor( private cookieService: CookieService){

  }
  public user_profile_details:any = this.cookieService.get('login_user_details')? JSON.parse(this.cookieService.get('login_user_details')) : {}
 }
