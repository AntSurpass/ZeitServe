import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsComponent } from './news.component';
import { NewsRouterModule } from './news-router.module';
import { SharedModule } from '../../shared/shared.module';
import { WholeComponent } from './whole/whole.component';
import { CreationComponent } from './creation/creation.component';
import { ActivityComponent } from './activity/activity.component';
import { NewProductsComponent } from './new-products/new-products.component';
import { NewsdetailsComponent } from './newsdetails/newsdetails.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NewsRouterModule
  ],
  // tslint:disable-next-line:max-line-length
  declarations: [NewsComponent, WholeComponent, CreationComponent, ActivityComponent, NewProductsComponent, NewsdetailsComponent]
})
export class NewsModule { }
