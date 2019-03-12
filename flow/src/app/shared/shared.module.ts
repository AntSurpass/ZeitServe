import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MessageBoxComponent } from './message-box/message-box.component';
import { LoadingComponent } from './loading/loading.component';
import { MaskComponent } from './mask/mask.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(
      {
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }
    )
  ],
  declarations: [MessageBoxComponent, LoadingComponent, MaskComponent],
  providers: [],
  exports: [
    TranslateModule,
    CommonModule,
    MaskComponent,
    LoadingComponent
  ]
})
export class SharedModule { 
  constructor(translateSrv: TranslateService) {
    translateSrv.setDefaultLang('en');
    translateSrv.use('en');
  }
}
