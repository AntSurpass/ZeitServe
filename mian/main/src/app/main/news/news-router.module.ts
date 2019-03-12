import { NgModule } from '@angular/core';
import { NewsComponent } from './news.component';
import { Routes, RouterModule } from '@angular/router';
import { NewProductsComponent } from './new-products/new-products.component';
import { CreationComponent } from './creation/creation.component';
import { ActivityComponent } from './activity/activity.component';
import { WholeComponent } from './whole/whole.component';
import { NewsdetailsComponent } from './newsdetails/newsdetails.component';

const routes: Routes = [
    {
        path: '',
        component: NewsComponent,
        children: [
            {
              path: '',
              component: WholeComponent
            },
            {
              path: 'whole',
              component: WholeComponent
            },
            {
              path: 'activity',
              component: ActivityComponent
            },
            {
              path: 'creation',
              component: CreationComponent
            },
            {
              path: 'newsProducts',
              component: NewProductsComponent
            },
            {
              path: 'newsdetails/:id',
              component: NewsdetailsComponent
            }
          ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class NewsRouterModule {

}

