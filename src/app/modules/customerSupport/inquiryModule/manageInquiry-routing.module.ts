import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { addNewInquiryComponent } from './addNewInquiry/addNewInquiry.component';
import { editInquiryComponent } from './editInquiry/editInquiry.component';
import { allInquiriesListComponent } from './inquiriesList/inquiriesList.component';
import { inquiryDetailComponent } from './inquiryDetail/inquiryDetail.component';

const routes: Routes = [
  { path: 'new', component: addNewInquiryComponent },
  { path: 'all', component: allInquiriesListComponent },
  { path: 'detail/:id', component: inquiryDetailComponent },
  { path: 'edit/:id', component: editInquiryComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],




  exports: [RouterModule],
})
export class manageInquiryRoutingModule { }

export const routedComponents = [
  addNewInquiryComponent,
  allInquiriesListComponent,
  inquiryDetailComponent,
  editInquiryComponent
];
