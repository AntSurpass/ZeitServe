import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadComponent } from './download.component';
import { DownLoadRouterModule } from './download-router.module';

@NgModule({
  imports: [
    CommonModule,
    DownLoadRouterModule
  ],
  declarations: [DownloadComponent]
})
export class DownloadModule { }
