import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminComponent } from './admin.component';
import { AdminNewsComponent } from './admin-news/admin-news.component';
import { AdminProductComponent } from './admin-product/admin-product.component';
import { AdminNewProductComponent } from './admin-new-product/admin-new-product.component';
import { AdminNewNewsComponent } from './admin-new-news/admin-new-news.component';
import { AdminNewsResolver } from './admin-news.rolver';
import { AdminProductResolver } from './admin-product.rolver';
import { AdminBannerComponent } from './admin-banner/admin-banner.component';
import { AdminVideoComponent } from './admin-video/admin-video.component';
import { AdminNewVideoComponent } from './admin-new-video/admin-new-video.component';
import { AdminVideoResolver } from './admin-video.rolver';

@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule
  ],
  declarations: [
    AdminHomeComponent,
    AdminLoginComponent,
    AdminComponent,
    AdminNewsComponent,
    AdminProductComponent,
    AdminNewProductComponent,
    AdminNewNewsComponent,
    AdminBannerComponent,
    AdminVideoComponent,
    AdminNewVideoComponent
  ],
  providers: [AdminNewsResolver, AdminProductResolver, AdminVideoResolver]
})
export class AdminModule { }
