import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { addNewInquiryComponent } from './addNewInquiry/addNewInquiry.component';
import { addNewAgentComponent } from './customerSupport/addNewUser.component';
import { allInquiriesListComponent } from './inquiriesList/inquiriesList.component';


const routes: Routes = [
  { path: 'new', component: addNewInquiryComponent },
  { path: 'all', component: allInquiriesListComponent },
  { path: 'agent' , component:addNewAgentComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],



  exports: [RouterModule],
})
export class manageInquiryRoutingModule { }

export const routedComponents = [
  addNewInquiryComponent,
  allInquiriesListComponent,
  addNewAgentComponent
];
