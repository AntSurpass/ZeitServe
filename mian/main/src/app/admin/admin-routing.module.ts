import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: AdminHomeComponent
      },
      {
        path: 'home',
        component: AdminHomeComponent
      },
      {
        path: 'news',
        component: AdminNewsComponent
      },
      {
        path: 'product',
        component: AdminProductComponent
      },
      {
        path: 'new-news',
        component: AdminNewNewsComponent
      },
      {
        path: 'news/:id',
        component: AdminNewNewsComponent,
        resolve: {
          news: AdminNewsResolver
        }
      },
      {
        path: 'product/:id',
        component: AdminNewProductComponent,
        resolve: {
          product: AdminProductResolver
        }
      },
      {
        path: 'new-product',
        component: AdminNewProductComponent
      },
      {
        path: 'banner',
        component: AdminBannerComponent
      },
      {
        path: 'video',
        component: AdminVideoComponent
      },
      {
        path: 'new-video',
        component: AdminNewVideoComponent
      },
      {
        path: 'video/:id',
        component: AdminNewVideoComponent,
        resolve: {
          video: AdminVideoResolver
        }
      }
    ]
  },
  {
    path: 'login',
    component: AdminLoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
