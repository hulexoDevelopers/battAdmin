import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../core/core.module';


import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { rightSidebarComponent } from './components/rightBar/rightbar.component';
import { sharedPopupsModule } from './sharedPopups.module';

import { AgmCoreModule } from '@agm/core';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
const sharedComponents = [

  HeaderComponent,
  SidebarComponent,
  rightSidebarComponent,
  FooterComponent,

];

@NgModule({
  imports: [
    CommonModule,
    NgxPaginationModule,
    RouterModule,
    NgxUiLoaderModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA2Xs1XgrxpKiilv6LxjOEi128JhkHB-do',
      libraries: ['places']
    }),
    CoreModule,
    sharedPopupsModule




  ],
  declarations: [sharedComponents],
  exports: sharedComponents,
  providers: [],
  entryComponents: []
})
export class SharedModule { }
