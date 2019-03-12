import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { UiEditorService } from './ui-editor.service';
import { BlocklyEditorService } from './blockly-editor.service';
import { CodeEditorService } from './code-editor.service';
import { StoreService } from './store.service';
import { CodeMakerService } from './code-maker.service';
import { GlobalOperatorService } from './global-operator.service';
import { UploadService } from './upload.service';
import { MaskComponent } from '../shared/mask/mask.component';
import { UnitModalComponent } from '../workspace/unit-modal/unit-modal.component';
import { ZrenderHelperService } from './zrender-helper.service';
import { httpInterceptorProviders } from '../http-interceptors';
import { MessageBoxComponent } from '../shared/message-box/message-box.component';
import { ZrenderHelperMbService } from './zrender-helper-mb.service';

export {
  UploadService,
  UiEditorService,
  BlocklyEditorService,
  CodeEditorService,
  StoreService,
  CodeMakerService,
  GlobalOperatorService,
  ZrenderHelperService,
  ZrenderHelperMbService
}

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  declarations: [],
  entryComponents: [MaskComponent, UnitModalComponent, MessageBoxComponent],
  providers: [httpInterceptorProviders]
})
export class ServicesModule {
  static forRoot() {
    return {
      ngModule: ServicesModule,
      providers: [
        UploadService,
        UiEditorService,
        BlocklyEditorService,
        CodeEditorService,
        StoreService,
        CodeMakerService,
        GlobalOperatorService,
        ZrenderHelperService,
        ZrenderHelperMbService
      ]
    }
  }
}
