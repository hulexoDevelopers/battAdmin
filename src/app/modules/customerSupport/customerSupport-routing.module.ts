import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { adminGuard } from '../shared/auth/adminGuard';
import { mainPanelComponent } from './mainPanel/mainPanel.component';
import { agentGuard } from './../shared/auth/agentGuard';

const routes: Routes = [
  { path: '', component: mainPanelComponent },
  {
    path: 'inquiry',
    loadChildren: () => import('./inquiryModule/manageInquiry.module').then(m => m.manageInquiryModule),
    canActivate: [agentGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],





  exports: [RouterModule],
  providers: [adminGuard,agentGuard]
})
export class customerSupportRoutingModule { }

export const routedComponents = [
  mainPanelComponent,


];
