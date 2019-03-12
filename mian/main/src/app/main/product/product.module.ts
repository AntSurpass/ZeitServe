import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProductRoutingModule } from './product-routing.module';

import { ProductComponent } from './product.component';
import { AccessoryComponent } from './accessory/accessory.component';
import { CoreComponent } from './core/core.component';
import { ModuleComponent } from './module/module.component';
import { UnitComponent } from './unit/unit.component';
import { ProductdetailsComponent } from './productdetails/productdetails.component';
@NgModule({
  imports: [
    SharedModule,
    ProductRoutingModule
  ],
  // tslint:disable-next-line:max-line-length
  declarations: [ProductComponent, AccessoryComponent, CoreComponent, ModuleComponent, UnitComponent, ProductdetailsComponent]
})
export class ProductModule { }
