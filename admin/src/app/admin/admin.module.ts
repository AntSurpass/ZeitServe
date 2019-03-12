import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessageComponent } from '../message/message.component';
import { NewsComponent } from '../news/news.component';
import { ProductComponent } from '../product/product.component';
import { AddNewsComponent } from '../add-news/add-news.component';
import { AddProductComponent } from '../add-product/add-product.component';
import { VideoComponent } from '../video/video.component';
import { AddVideoComponent } from '../add-video/add-video.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';
import { ProductResolver } from '../rolvers/product.resolver';
import { NewsResolver } from '../rolvers/news.resolver';
import { VideoResolver } from '../rolvers/video.resolver';
import { CountComponent } from '../count/count.component';

import {NgxEchartsModule} from 'ngx-echarts';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: '',
                component: MessageComponent
            },
            {
                path: 'product',
                component: ProductComponent
            },
            {
                path: 'news',
                component: NewsComponent
            },
            {
                path: 'video',
                component: VideoComponent
            },
            {
                path: 'count',
                component: CountComponent
            },
            {
                path: 'add-product',
                component: AddProductComponent
            },
            {
                path: 'add-news',
                component: AddNewsComponent
            },
            {
                path: 'add-video',
                component: AddVideoComponent
            },
            {
                path: 'product/:id',
                component: AddProductComponent,
                resolve: {
                    product: ProductResolver
                }
            },
            {
                path: 'news/:id',
                component: AddNewsComponent,
                resolve: {
                    news: NewsResolver
                }
            },
            {
                path: 'video/:id',
                component: AddVideoComponent,
                resolve: {
                    video: VideoResolver
                }
            }
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgZorroAntdModule,
        ReactiveFormsModule,
        FormsModule,
        NgxEchartsModule
    ],
    declarations: [
        AdminComponent,
        MessageComponent,
        NewsComponent,
        CountComponent,
        ProductComponent,
        VideoComponent,
        AddProductComponent,
        AddNewsComponent,
        AddVideoComponent
    ],
    providers: [ProductResolver, NewsResolver, VideoResolver]
})
export class AdminModule {

}