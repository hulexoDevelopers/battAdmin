import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { washPackageComponent } from './washPackage/washPackage.component';



const routes: Routes = [
  { path: 'package/detail', component: washPackageComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],



  exports: [RouterModule],
})
export class managePackagesRoutingModule { }

export const routedComponents = [
  washPackageComponent
];
