import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { addNewTyreComponent } from './addNewTyre/addNewTyre.component';
import { tyreCompaniesComponent } from './tyreCompanies/tyreCompanies.component';
import { allTyresListComponent } from './allTyresList/allTyresList.component';
import { tyreDetailComponent } from './tyreDetail/tyreDetail.component';

const routes: Routes = [
  { path: 'brands', component: tyreCompaniesComponent },
  { path: 'detail/:id', component: tyreDetailComponent },
  { path: 'new', component: addNewTyreComponent },
  { path: 'all', component: allTyresListComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],






  exports: [RouterModule],
})
export class manageTyresRoutingModule { }

export const routedComponents = [
  tyreCompaniesComponent,
  addNewTyreComponent,
  allTyresListComponent,
  tyreDetailComponent
];
