import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShappingComponent } from './shapping.component';
import { ShappingRouterModule } from './shapping-router.module';

@NgModule({
  imports: [
    CommonModule,
    ShappingRouterModule
  ],
  declarations: [ShappingComponent]
})
export class ShappingModule { }
