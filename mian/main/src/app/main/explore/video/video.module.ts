import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoComponent } from './video.component';
import { SharedModule } from '../../../shared/shared.module';
import { VideoRouterModule } from './video-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    VideoRouterModule
  ],
  declarations: [VideoComponent]
})
export class VideoModule { }
