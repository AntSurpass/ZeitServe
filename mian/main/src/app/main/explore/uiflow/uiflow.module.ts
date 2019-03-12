import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiflowComponent } from './uiflow.component';
import { UIflowRouterModule } from './uiflow-routing.module';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIflowRouterModule
  ],
  declarations: [UiflowComponent]
})
export class UiflowModule { }
