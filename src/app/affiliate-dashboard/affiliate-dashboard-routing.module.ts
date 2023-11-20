import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ResolveService } from '../services/resolve.service';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: { data: ResolveService },
    data: {
      requestcondition: {
        
      },
      endpoint: 'marketing/dashboard-campaign-list',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AffiliateDasboardRoutingModule {}
