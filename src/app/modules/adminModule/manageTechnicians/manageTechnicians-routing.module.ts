import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { addNewTechnicianComponent } from './addNewTechnician/addNewTechnician.component'
import { allTechniciansListComponent } from './allTechniciansList/allTechniciansList.component';
import { technicianDetailComponent } from './technicianDetail/technicianDetail.component';
import { technicianSortingComponent } from './technicianSorting/technicianSorting.component';


const routes: Routes = [
  { path: 'new', component: addNewTechnicianComponent },
  { path: 'all', component: allTechniciansListComponent },
  { path: 'detail/:id', component: technicianDetailComponent },
  { path: 'busiest', component:technicianSortingComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],




  exports: [RouterModule],
})
export class manageTechnicianRoutingModule { }

export const routedComponents = [
  addNewTechnicianComponent,
  allTechniciansListComponent,
  technicianDetailComponent,
  technicianSortingComponent
];
