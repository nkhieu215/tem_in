import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ListMaterialComponent } from '../list/list-material.component';

const listMaterialRoute: Routes = [
  {
    path: '',
    component: ListMaterialComponent,
    data: {
      mapToCanActivate: 'id, asc',
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(listMaterialRoute)],
  exports: [RouterModule],
})
export class ListMaterialRoutingModule {}
