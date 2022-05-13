import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routedComponents, customerSupportRoutingModule } from './customerSupport-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core';
// import { SelectDropDownModule } from 'ngx-select-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgApexchartsModule } from 'ng-apexcharts';
@NgModule({
  declarations: [routedComponents],
  imports: [
    CommonModule,
    customerSupportRoutingModule,
    Ng2SearchPipeModule,
    NgApexchartsModule,
    NgxDaterangepickerMd,
    NgxPaginationModule,
    SelectDropDownModule,
    SharedModule,
    CoreModule
  ],
  providers: [],
  // entryComponents: [allMealsCalendarComponent]
})
export class customerSupportModule { }
