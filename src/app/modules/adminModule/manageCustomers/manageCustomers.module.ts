import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routedComponents, manageCustomersRoutingModule } from './manageCustomers-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  declarations: [routedComponents],
  imports: [
    CommonModule,
    manageCustomersRoutingModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    SelectDropDownModule,
    SharedModule,
    CoreModule
  ],
  providers: [],
  // entryComponents: [allMealsCalendarComponent]
})
export class manageCustomersModule { }
