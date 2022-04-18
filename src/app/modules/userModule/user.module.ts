import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routedComponents, userRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core';


@NgModule({
  declarations: [routedComponents],
  imports: [
    CommonModule,
    userRoutingModule,
    SharedModule,
    CoreModule
  ],
  providers: [],
  // entryComponents: [allMealsCalendarComponent]
})
export class userModule { }
