import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Page404Component } from './page404/page404.component';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: '../admin/admin.module#AdminModule',
  },
  {
    path: '',
    loadChildren: '../main/home/home.module#HomeModule',
    data: {animation: 'main'}
  },
  {
    path: 'product',
    loadChildren: '../main/product/product.module#ProductModule',
    data: {animation: 'product'}
  },
  {
    path: 'news',
    loadChildren: '../main/news/news.module#NewsModule',
    data: {animation: 'news'}
  },
  {
    path: 'about',
    loadChildren: '../main/about/about.module#AboutModule',
    data: {animation: 'about'}
  },
  {
    path: 'uiflow',
    loadChildren: '../main/explore/uiflow/uiflow.module#UiflowModule',
    data: {animation: 'uiflow'}
  },
  {
    path: 'video',
    loadChildren: '../main/explore/video/video.module#VideoModule',
    data: {animation: 'video'}
  },
  {
    path: 'stem',
    loadChildren: '../main/explore/stem/stem.module#StemModule',
    data: {animation: 'stem'}
  },
  {
    path: 'download',
    loadChildren: '../main/download/download.module#DownloadModule',
    data: {animation: 'stem'}
  },
  {
    path: 'shapping',
    loadChildren: '../main/shapping/shapping.module#ShappingModule',
    data: {animation: 'shapping'}
  },
  {
    path: '**',
    component: Page404Component
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
