import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { adminGuard } from '../shared/auth/adminGuard';
import { adminPanelComponent } from './adminPanel/adminPanel.component';



const routes: Routes = [
  { path: '', component: adminPanelComponent },
  {
    path: 'vehicles',
    loadChildren: () => import('./manageVehicles/manageVehicles.module').then(m => m.manageVehicleModule),
    canActivate: [adminGuard]
  },
  {
    path: 'tyres',
    loadChildren: () => import('./manageTyres/manageTyres.module').then(m => m.manageTyresModule),
    canActivate: [adminGuard]
  },
  {
    path: 'oils',
    loadChildren: () => import('./manageOil/manageOils.module').then(m => m.manageOilsModule),
    canActivate: [adminGuard]
  },
  {
    path: 'customers',
    loadChildren: () => import('./manageCustomers/manageCustomers.module').then(m => m.manageCustomersModule),
    canActivate: [adminGuard]
  },

  {
    path: 'battery',
    loadChildren: () => import('./manageBatteries/manageBatteries.module').then(m => m.manageBatteriesModule),
    canActivate: [adminGuard]
  },

  {
    path: 'technician',
    loadChildren: () => import('./manageTechnicians/manageTechnicians.module').then(m => m.manageTechnicianModule),
    canActivate: [adminGuard]
  },


  {
    path: 'inquiry',
    loadChildren: () => import('./manageInquiries/manageInquiry.module').then(m => m.manageInquiryModule),
    canActivate: [adminGuard]
  },
  {
    path: 'carwash',
    loadChildren: () => import('./manageCarWash/washPackage.module').then(m => m.managepackagesModule),
    canActivate: [adminGuard]
  },

  {
    path: 'setting',
    loadChildren: () => import('./settings/manageprofile.module').then(m => m.manageProfileModule),
    canActivate: [adminGuard]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],



  exports: [RouterModule],
  providers: [adminGuard]
})
export class adminRoutingModule { }

export const routedComponents = [
  adminPanelComponent,


];
