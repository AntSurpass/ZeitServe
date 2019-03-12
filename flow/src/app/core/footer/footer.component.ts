import { Component, OnInit } from '@angular/core';
import { UploadService, CodeEditorService, GlobalOperatorService, StoreService } from '../../services/services.module';
import { Observable } from 'rxjs';
import { MaskComponent } from 'src/app/shared/mask/mask.component';
import { DYNAMIC_COMPONENT_TYPE } from 'src/app/utils/common-data';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  codeLock$: Observable<boolean>;

  mode$: Observable<string>;

  apikey$: Observable<string>;

  constructor(
    private uploadSrv: UploadService,
    private globalOperatorSrv: GlobalOperatorService,
    private codeEditorSrv: CodeEditorService,
    public storeSrv: StoreService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.codeLock$ = this.globalOperatorSrv.getCodeLock();
    this.mode$ = this.globalOperatorSrv.getMode();
    this.apikey$ = this.storeSrv.getApikey();
  }

  refreshStatus() {
    this.uploadSrv.getDeviceInfo().subscribe(res => {
      if(res.code === 3) return
      // this.translate.get('EXECUTECODE_ERROR').subscribe((res: string) => {
      //   this.globalOperatorSrv.createMessageBox().instance.error(res);
      // });
      if (res.data[0] !== this.storeSrv.VERSION) {
        this.translate.get('FIRMWARE_WARNING', {value: this.storeSrv.VERSION }).subscribe((res: string) => {
          this.globalOperatorSrv.createMessageBox().instance.warning(res);
        });
      }
    }, err => {
      this.translate.get('EXECUTECODE_ERROR').subscribe((res: string) => {
        this.globalOperatorSrv.createMessageBox().instance.error(res);
      });
    });
  }

  toggleCodeLock() {
    this.globalOperatorSrv.setCodeLock(!this.globalOperatorSrv.codeLock.value);
    if(!this.globalOperatorSrv.codeLock.value) {
      this.codeEditorSrv.updateWorkspaceValue();
    }
  }

  openSettingPanel() {
    let modal = this.globalOperatorSrv.createMaskModal(MaskComponent);
    (<MaskComponent>modal.instance).createDynamicComponent(DYNAMIC_COMPONENT_TYPE.SETTING_PANEL);
  }
}
