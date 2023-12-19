import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ResolveService } from '../services/resolve.service';
import { PieChartComponent } from './pie-chart/pie-chart.component';

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
  {
    path: 'user',
    loadChildren: () =>
      import('./users/users.module').then(
        (m) => m.UsersModule
      )
  },
  {
    path: 'report',
    loadChildren: () =>
      import('./report/report.module').then(
        (m) => m.ReportModule
      )
  },
  {
    path: 'pie-chart',
    component: PieChartComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AffiliateDasboardRoutingModule {}
