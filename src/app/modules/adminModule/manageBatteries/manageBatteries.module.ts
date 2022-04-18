import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routedComponents, manageBatteriesRoutingModule } from './manageBatteries-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { resourceService } from '../../shared/services/reource.service';
@NgModule({
  declarations: [routedComponents],
  imports: [
    CommonModule,
    manageBatteriesRoutingModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    SelectDropDownModule,
    SharedModule,
    CoreModule
  ],
  providers: [
  ],
  // entryComponents: [allMealsCalendarComponent]
})
export class manageBatteriesModule { }


