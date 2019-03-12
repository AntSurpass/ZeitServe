import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StemComponent } from './stem.component';
import { StemRouterModule } from './stem-router.module';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    StemRouterModule
  ],
  declarations: [StemComponent]
})
export class StemModule { }
