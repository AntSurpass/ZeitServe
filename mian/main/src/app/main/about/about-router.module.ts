import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about.component';
import { ContactComponent } from './contact/contact.component';
import { ChildAboutComponent } from './childAbout/childAbout.component';

const routes: Routes = [
  {
    path: '',
    component: AboutComponent,
    children: [
      {
        path: '',
        // redirectTo: '/about/contact'
        component: ContactComponent
      },
      {
        path: 'contact',
        component: ContactComponent
      },
      {
        path: 'Cabout',
        component: ChildAboutComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRouterModule { }
