import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { adminProfileComponent } from './profile/profile.component';


const routes: Routes = [
  { path: 'profile', component: adminProfileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],


  exports: [RouterModule],
})
export class manageProfileRoutingModule { }

export const routedComponents = [
  adminProfileComponent
];
