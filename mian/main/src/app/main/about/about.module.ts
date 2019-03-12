import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about.component';
import { AboutRouterModule } from './about-router.module';
import { ContactComponent } from './contact/contact.component';
import { ChildAboutComponent } from './childAbout/childAbout.component';
import { FormsModule } from '@angular/forms';
import { CheckEmailDirective } from '../../common/directive/checkEmail.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AboutRouterModule
  ],
  declarations: [AboutComponent, ContactComponent, ChildAboutComponent,CheckEmailDirective]
})
export class AboutModule { }
