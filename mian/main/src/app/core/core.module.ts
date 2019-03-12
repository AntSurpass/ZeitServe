import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Page404Component } from './page404/page404.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TipsComponent } from './tips/tips.component';

@NgModule({
  imports: [
    SharedModule,
    HttpModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  declarations: [Page404Component, HeaderComponent, FooterComponent, TipsComponent],
  exports: [HeaderComponent, FooterComponent, Page404Component, TipsComponent,  AppRoutingModule],
  providers: []
})
export class CoreModule { 
  constructor(
    @Optional() @SkipSelf() parentModuel: CoreModule
  ) {
    if(parentModuel) {
      throw new Error('CoreModule has already loaded, please only load this module in AppModule.');
    }
  }
}
