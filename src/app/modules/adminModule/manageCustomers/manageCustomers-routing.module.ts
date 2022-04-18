import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { addNewCustomerComponent } from './addNewCustomer/addNewCustomer.component'
import { allCustomersListComponent } from './allCustomersList/allCustomersList.component';
// import { allTechniciansListComponent } from './allTechniciansList/allTechniciansList.component';
// import { technicianDetailComponent } from './technicianDetail/technicianDetail.component';

const routes: Routes = [
  // { path: 'brands' , component:vehicleBrandsComponent},
  { path: 'new', component: addNewCustomerComponent },
  { path: 'all', component: allCustomersListComponent },
  // { path: 'detail/:id', component: technicianDetailComponent },
  // { path: 'all', component: allCompaniesListComponent },
  // { path: 'edit/:id' , component: editCompanyProfileComponent},
  // { path: 'detail/:id' , component: companyDetailComponent},
  // { path: 'plans/:id' , component: companyAllMealPlansComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],



  exports: [RouterModule],
})
export class manageCustomersRoutingModule { }

export const routedComponents = [
  addNewCustomerComponent,
  allCustomersListComponent
];
