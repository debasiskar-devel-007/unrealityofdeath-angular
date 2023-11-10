import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'affiliate-dashboard',
    loadChildren:() => import('./affiliate-dashboard/affiliate-dashboard.module').then((m)=> m.AffiliateDashboardModule) 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
