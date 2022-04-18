import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { adminGuard } from './modules/shared/auth/adminGuard';
import { agentGuard } from './modules/shared/auth/agentGuard';
import { companyGuard } from './modules/shared/auth/companyGuard';
import { customerGuard } from './modules/shared/auth/customerGuard';

const routes: Routes = [

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  // {
  //   path: '',
  //   loadChildren: () => import('./modules/pages/pages.module').then(m => m.pagesModule),

  // },
  {
    path: 'user',
    loadChildren: () => import('./modules/userModule/user.module').then(m => m.userModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/adminModule/admin.module').then(m => m.adminModule),
    canActivate: [adminGuard]
  },
  {
    path: 'support',
    loadChildren: () => import('./modules/customerSupport/customerSupport.module').then(m => m.customerSupportModule),
    canActivate: [agentGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {

    scrollPositionRestoration: 'enabled', // Add options right here
  })],
  exports: [RouterModule],
  providers: [adminGuard, agentGuard, customerGuard]
})
export class AppRoutingModule {

}
