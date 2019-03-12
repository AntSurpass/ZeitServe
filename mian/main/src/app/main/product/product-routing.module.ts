import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './product.component';
import { CoreComponent } from './core/core.component';
import { ModuleComponent } from './module/module.component';
import { UnitComponent } from './unit/unit.component';
import { AccessoryComponent } from './accessory/accessory.component';
import { ProductdetailsComponent } from './productdetails/productdetails.component';

const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    children: [
      {
        path: '',
        component: CoreComponent
      },
      {
        path: 'core',
        component: CoreComponent
      },
      {
        path: 'module',
        component: ModuleComponent
      },
      {
        path: 'unit',
        component: UnitComponent
      },
      {
        path: 'accessory',
        component: AccessoryComponent
      },
      {
        path: 'productdetails/:id',
        component: ProductdetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
