import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResolveService } from '../services/resolve.service';
import { AccountInfoComponent } from './account-info/account-info.component';

const routes: Routes = [
//   {path: 'account-info/:_id', component: AccountInfoComponent,
//   resolve: { data: ResolveService },
//   data: {
//     requestcondition: {
//     },
//     endpoint: 'user-api/fetch-login-detail'
//   },
// }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAccountRoutingModule { }
