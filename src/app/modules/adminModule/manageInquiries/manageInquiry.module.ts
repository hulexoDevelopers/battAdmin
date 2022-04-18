import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routedComponents, manageInquiryRoutingModule } from './manageInquiry-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AgmCoreModule } from '@agm/core';
// import { GooglePlaceModule } from "ngx-google-places-autocomplete";
@NgModule({
  declarations: [routedComponents],
  imports: [
    CommonModule,
    GooglePlaceModule,
    manageInquiryRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA2Xs1XgrxpKiilv6LxjOEi128JhkHB-do',
      libraries: ['places']
    }),
    Ng2SearchPipeModule,
    NgxPaginationModule,
    SelectDropDownModule,
    SharedModule,
    CoreModule
  ],
  providers: [],
  // entryComponents: [allMealsCalendarComponent]
})
export class manageInquiryModule { }
