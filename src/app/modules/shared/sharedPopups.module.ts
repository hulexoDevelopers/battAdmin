import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../core/core.module';
import { SelectDropDownModule } from 'ngx-select-dropdown';

import { editUserProfileComponent } from './popups/editUser/editUser.component';
import { updateBatteryStockComponent } from './popups/updateStock/updateStock.component';
import { editTechnicianStockComponent } from './popups/batteryModule/editTechnicianStock/editTechnicianStock.component';
import { washVehiclesComponent } from './popups/getWashVehicles/getWashVehicles.component';
import { packageDetailComponent } from './popups/packageDetail/packageDetail.component';

import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { editBrandComponent } from './popups/vehicleModule/editBrand/editBrand.component';
import { addNewBrandComponent } from './popups/vehicleModule/addNewBrand/addNewBrand.component';
import { addNewBatteryCompanyComponent } from './popups/batteryModule/addNewBatteryCompany/addNewBatteryCompany.component';
import { editBatteryCompanyComponent } from './popups/batteryModule/editBatteryCompany/editBatteryCompany.component';
import { editBatteryComponent } from './popups/batteryModule/editBattery/editBattery.component';
import { editVehicleComponent } from './popups/vehicleModule/editVehicle/editVehicle.component';
import { editBatteryStockComponent } from './popups/batteryModule/editBatteryStock/editBatteryStock.component';
import { addNewCompanyComponent } from './popups/companyModule/addNewCompany/addNewCompany.component';
import { editCompanyComponent } from './popups/companyModule/editCompany/editCompany.component';
import { editTyreComponent } from './popups/tyreModule/editTyre/editTyre.component';
import { updateTyreStockComponent } from './popups/tyreModule/updateTyreStock/updateTyreStock.component';
import { editTyreStockComponent } from './popups/tyreModule/editTyreStock/editTyreStock.component';
import { editOilComponent } from './popups/oilModule/editOil/editOIl.component';
import { assignOilStockComponent } from './popups/oilModule/assignOilStock/assignOilStock.component';
import { updateOilStockComponent } from './popups/oilModule/updateOilStock/updateOilStock.component';
import { editOilStockComponent } from './popups/oilModule/editOilStock/editOilStock.component';
import { assignBatteryStockComponent } from './popups/batteryModule/assignBatteryStock/assignBatteryStock.component';
import { assignTechnicianStockComponent } from './popups/tyreModule/assignTechnicianStock/assignTechnicianStock.component';
import { editTechnicianOilStockComponent } from './popups/oilModule/editTechOilStock/editTechnicianOilStock.component';
import { editTechnicianTyreStockComponent } from './popups/tyreModule/editTechnicianTyreStock/editTechnicianTyreStock.component';


const sharedComponents = [
  editBrandComponent,
  addNewBrandComponent,
  addNewBatteryCompanyComponent,
  editBatteryCompanyComponent,
  editBatteryComponent,
  editVehicleComponent,
  editBatteryStockComponent,
  editUserProfileComponent,
  assignTechnicianStockComponent,
  updateBatteryStockComponent,
  washVehiclesComponent,
  editTechnicianStockComponent,
  addNewCompanyComponent,
  packageDetailComponent,
  editCompanyComponent,
  editTyreComponent,
  updateTyreStockComponent,
  editTyreStockComponent,
  editOilComponent,
  assignOilStockComponent,
  updateOilStockComponent,
  editOilStockComponent,
  assignBatteryStockComponent,
  editTechnicianOilStockComponent,
  editTechnicianTyreStockComponent
];

@NgModule({
  imports: [

  SelectDropDownModule,
    NgxUiLoaderModule,
    CommonModule,
    RouterModule,
    CoreModule,

  ],
  declarations: [sharedComponents
  ],
  exports: sharedComponents,
  providers: [],
  entryComponents: [
    sharedComponents
    // editBrandComponent
  ]
})
export class sharedPopupsModule { }
