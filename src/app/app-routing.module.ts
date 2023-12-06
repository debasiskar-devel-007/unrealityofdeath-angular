import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AccountInfoComponent } from './my-account/account-info/account-info.component';
import { ResolveService } from './services/resolve.service';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'affiliate-dashboard',
    loadChildren:() => import('./affiliate-dashboard/affiliate-dashboard.module').then((m)=> m.AffiliateDashboardModule),
    canActivate:[AuthGuardService]
  },
  {
    path: 'my-account/account-info',
component: AccountInfoComponent,
resolve: { data: ResolveService },
  data: {
    requestcondition: {
    },
    endpoint: 'user-api/fetch-login-detail'
  },

  },
  {
    path: 'change-password',
    loadChildren: () =>
      import('./change-password/change-password.module').then(
        (m) => m.ChangePasswordModule
      )
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
