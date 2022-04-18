import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { addNewOilComponent } from './addNewOil/addNewOil.component';
import { allOilsListComponent } from './allOilsList/allOilsList.component';
import { oilCompaniesComponent } from './oilCompanies/oilCompanies.component';
import { oilDetailComponent } from './oilDetail/oilDetail.component';

const routes: Routes = [
  { path: 'brands', component: oilCompaniesComponent },
  { path: 'detail/:id', component: oilDetailComponent },
  { path: 'new', component: addNewOilComponent },
  { path: 'all', component: allOilsListComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],







  exports: [RouterModule],
})
export class manageOilsRoutingModule { }

export const routedComponents = [
  addNewOilComponent,
  oilCompaniesComponent,
  allOilsListComponent,
  oilDetailComponent
];
