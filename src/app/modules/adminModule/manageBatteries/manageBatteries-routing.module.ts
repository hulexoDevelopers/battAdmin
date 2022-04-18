import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { batteryCompaniesComponent } from './batteryCompanies/batteryCompanies.component';
import { addNewBatteryComponent } from './addNewBattery/addNewBattery.component';
import { batteryDetailComponent } from './batteryDetail/batteryDetail.component';
import { allBatteriesListComponent } from './allBatteriesList/allBatteriesList.component';


const routes: Routes = [
  { path: 'brands', component: batteryCompaniesComponent },
  { path: 'detail/:id', component: batteryDetailComponent },
  { path: 'new', component: addNewBatteryComponent },
  { path: 'all' , component: allBatteriesListComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],




  exports: [RouterModule],
})
export class manageBatteriesRoutingModule { }

export const routedComponents = [
  batteryCompaniesComponent,
  addNewBatteryComponent,
  batteryDetailComponent,
  allBatteriesListComponent
];
