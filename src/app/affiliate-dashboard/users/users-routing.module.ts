import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResolveService } from 'src/app/services/resolve.service';
import { UserListComponent } from './user-list/user-list.component';
import { UserAddEditComponent } from './user-add-edit/user-add-edit.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    resolve: { data: ResolveService },
    data: {
      requestcondition: {
        condition: {
          limit: 10,
          skip: 0,
        },
        searchcondition: {},
        sort: {
          type: 'desc',
          field: 'created_on',
        },
        project: {},
        token: '',
      },

      endpoint: 'user-api/user-list-new',
    },
  },
  {
    path: 'user-edit/:id',
    component: UserAddEditComponent,
    resolve: { data: ResolveService },
    data: {
      requestcondition: {},
      endpoint: 'user-api/userdata-preview',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
