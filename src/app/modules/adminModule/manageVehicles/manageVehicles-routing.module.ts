import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { addNewVehicleComponent } from './addNewVehicles/addNewVehicle.component';
import { allVehiclesListComponent } from './allVehiclesList/allVehiclesList.component';
import { vehicleBrandsComponent } from './vehicleBrands/vehicleBrands.component';
// import { allCompaniesListComponent } from './allCompaniesList/allCompaniesList.component';
// import { editCompanyProfileComponent } from './editCompanyProfile/editCompanyProfile.component';
// import { companyDetailComponent } from './companyDetail/companyDetail.component';
// import { companyAllMealPlansComponent } from './companyMealPlans/companyMealPlans.component';

const routes: Routes = [
  { path: 'brands', component: vehicleBrandsComponent },
  { path: 'new', component: addNewVehicleComponent },
  { path: 'all', component: allVehiclesListComponent }
  // { path: 'all', component: allCompaniesListComponent },
  // { path: 'edit/:id' , component: editCompanyProfileComponent},
  // { path: 'detail/:id' , component: companyDetailComponent},
  // { path: 'plans/:id' , component: companyAllMealPlansComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],


  exports: [RouterModule],
})
export class manageVehicleRoutingModule { }

export const routedComponents = [
  vehicleBrandsComponent,
  addNewVehicleComponent,
  allVehiclesListComponent
];
