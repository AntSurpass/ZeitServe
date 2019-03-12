import { Component, OnInit } from '@angular/core';
import { slideDownAnimation } from '../../animations';
import { GlobalOperatorService, UploadService, CodeEditorService, CodeMakerService, StoreService } from 'src/app/services/services.module';
import { Observable } from 'rxjs';
import { MODE, DYNAMIC_COMPONENT_TYPE, EXAMPLES } from 'src/app/utils/common-data';
import { MaskComponent } from 'src/app/shared/mask/mask.component';
import { TranslateService } from '@ngx-translate/core';
import { timingSafeEqual } from 'crypto';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [slideDownAnimation]
})
export class HeaderComponent implements OnInit {

  dropdownState: string = 'hide';

  mode$: Observable<string>;

  projectName$: Observable<string>;

  remoteKey$: Observable<string>;

  erweima$: Observable<boolean>;

  copyTip = '';

  exampleVisibility = false;

  exampleDetail = null;

  isShowQRcode = false;

  exampleList = EXAMPLES;

  loddingMode = false;

  version = '';

  stick;
  constructor(
    private globalOperatorSrv: GlobalOperatorService,
    private uploadSrv: UploadService,
    private codeEditorSrv: CodeEditorService,
    private codeMakerSrv: CodeMakerService,
    private storeSrv: StoreService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.version = this.storeSrv.VERSION;
    this.mode$ = this.globalOperatorSrv.getMode();
    this.projectName$ = this.storeSrv.getProjectName();
    this.remoteKey$ = this.storeSrv.getRemoteKey();
    this.erweima$ = this.storeSrv.showerweima();
    this.storeSrv.setLoddingMode().subscribe((mode) => {
      this.loddingMode = mode as boolean;
    });

    if(this.storeSrv.apiKey.value === '') {
      this.openSettingPanel(null);
    }
    this.storeSrv.getType().subscribe( res => {
      if (res === 'stick') {
        this.stick = true;
      } else {
        this.stick = false;
      }
    });
  }

  openDropdownList() {
    if(this.dropdownState === 'show') return this.dropdownState = 'hide';
    this.dropdownState = 'show';
  }

  closeDropdownList(ev: MouseEvent) {
    this.dropdownState = 'hide';
  }

  setMode(mode) {

    this.globalOperatorSrv.setMode(mode);
    this.storeSrv.uieditorMode.next(true);
    if(mode === MODE.CODE) {
      this.codeEditorSrv.updateWorkspaceValue();
    } else {
      this.globalOperatorSrv.setUIVisibility(true);

    }
  }
  setMBMode(mode) {
    setTimeout(() => {
      this.globalOperatorSrv.setSelectedUnit(null);
      this.globalOperatorSrv.setSelectedComponent(null);
    }, 1);
    this.globalOperatorSrv.setMode(mode);
    this.storeSrv.uieditorMode.next(true);
    if(mode === MODE.CODE) {
      this.codeEditorSrv.updateWorkspaceValue();
    }
  }
  setuieditorMode(mode) {
    this.globalOperatorSrv.setMode(mode);
    this.storeSrv.uieditorMode.next(false);
  }
  execCode() {
    let code = '';
    if(this.globalOperatorSrv.mode.value === MODE.CODE) {
      code = this.codeEditorSrv.workspace.getValue();
    } else {
      code = this.codeMakerSrv.makeCode();
    }
   if(this.storeSrv.apiKey.value === '') {
    this.translate.get('KEY_ISNULL_ERROR').subscribe((res: string) => {
      this.globalOperatorSrv.createMessageBox().instance.error(res);
    });
    return;
  }
    if(window['Blockly']['Remotes'].length === 0) {
      this.uploadSrv.execCode(code).subscribe(data => {
        this.translate.get('EXECUTCODE_SUCCESS').subscribe((res: string) => {
          this.globalOperatorSrv.createMessageBox().instance.success(res);
        });
        
      }, err => {
        this.translate.get('REMOTE_ERROR').subscribe((res: string) => {
          this.globalOperatorSrv.createMessageBox().instance.error(res);
        });
      });
      return;
    }
    else {
      let dataObj = [];
      for (let j = 0; j < window["Blockly"].Remotes.length; j++) {
        dataObj.push({
          name: window["Blockly"].Remotes[j].name,
          event: window["Blockly"].Remotes[j].event,
          type: window["Blockly"].Remotes[j].type,
          icon: window["Blockly"].Remotes[j].icon || null
        });
      }
      let remoteData = JSON.stringify({
        id: this.storeSrv.apiKey.value,
        data: dataObj
      });
      this.uploadSrv.getRemoteKey(remoteData).subscribe(res => {
        window['Blockly'].REMOTE_KEY = res.data;
        this.storeSrv.setRemoteKey(`http://flow-remote.m5stack.com/?remote=${ res.data }`);
        this.uploadSrv.execCode(this.codeMakerSrv.makeCode()).subscribe(data => {
          this.translate.get('EXECUTCODE_SUCCESS').subscribe((res: string) => {
            this.globalOperatorSrv.createMessageBox().instance.success(res);
          });
        }, err => {
          this.translate.get('APIKRY_ERROR').subscribe((res: string) => {
            this.globalOperatorSrv.createMessageBox().instance.error(res);
          });
        });
      });
    }
  }

  openSettingPanel(ev) {
    if(ev !== null) {
      ev.stopPropagation();
      ev.preventDefault();
      this.dropdownState = 'hide';
    }
    let modal = this.globalOperatorSrv.createMaskModal(MaskComponent);
    (<MaskComponent>modal.instance).createDynamicComponent(DYNAMIC_COMPONENT_TYPE.SETTING_PANEL);
  }
  openResourceManager() {
    let modal = this.globalOperatorSrv.createMaskModal(MaskComponent);
    (<MaskComponent>modal.instance).createDynamicComponent(DYNAMIC_COMPONENT_TYPE.RESOURCE_MANAGER);
  }

  changeProjectName(ev) {
    this.storeSrv.setProjectName(ev.target.value);
  }

  uploadCode() {
    this.globalOperatorSrv.getCodeLock().subscribe( res => {
      if (!res) {
        this.codeEditorSrv.updateWorkspaceValue();
      }
    });
    if(this.storeSrv.apiKey.value === '') {
      this.translate.get('KEY_ISNULL_ERROR').subscribe((res: string) => {
        this.globalOperatorSrv.createMessageBox().instance.error(res);
      });
      return;
    }
    if(this.storeSrv.projectName.value === '') {
      this.translate.get('NAME_ISNULL_ERROR').subscribe((res: string) => {
        this.globalOperatorSrv.createMessageBox().instance.error(res);
      });
      return;
    }

    let code = '';
    if(this.globalOperatorSrv.mode.value === MODE.CODE) {
      code = this.codeEditorSrv.workspace.getValue();
    }
    else {
      // code = this.codeEditorSrv.workspace.getValue();
      code = this.codeMakerSrv.makeCode();
    }

    this.uploadSrv.beforeUploadCode().subscribe(res => {
      this.translate.get('UPLOADING_LOADING').subscribe((res: string) => {
        this.globalOperatorSrv.createMessageBox().instance.loading(res);
      });
      this.uploadSrv.uploadCode(code).subscribe(data => {
        this.translate.get('UPLOADING_SUCCESS').subscribe((res: string) => {
          this.globalOperatorSrv.createMessageBox().instance.error(res);
        });
        this.uploadSrv.saveBlocklyFile(this.globalOperatorSrv.saveM5F()).subscribe(res => {
          this.uploadSrv.afterUploadCode().subscribe();
        }); 
      }, err => {
        this.translate.get('EXECUTECODE_ERROR').subscribe((res: string) => {
          this.globalOperatorSrv.createMessageBox().instance.error(res);
        });
      });
    });
  }

  saveM5F() {
    let data = this.globalOperatorSrv.saveM5F();
    window['doSave'](JSON.stringify(data), 'text/latex', this.storeSrv.projectName.value + '.m5f');
  }

  openM5F() {
    let fileDom = document.getElementById('__openM5FBox');
    fileDom.click();
    fileDom.onchange = (ev) => {
      if (ev.target['files'].length === 0) return;
      let reader = new FileReader();
      reader.readAsText(ev.target['files'][0], "utf8");
      reader.onload = (e) => {
        let dataStr = e.target['result'];
        try {
          let data = JSON.parse(dataStr);
          this.globalOperatorSrv.openM5F(data);
          this.storeSrv.setProjectName(ev.target['files'][0].name.split(ev.target['files'][0].name.match(/.m5f/g)[0])[0]);
        } catch (err) {
          console.log(err);
          try {
            let data = JSON.parse(dataStr);
            this.globalOperatorSrv.openOldM5F(data);
            this.storeSrv.setProjectName(ev.target['files'][0].name.split(ev.target['files'][0].name.match(/.m5f/g)[0])[0]);
          } catch(err) {
            console.log(err);
          }
        }
        finally {
          ev.target['value'] = '';
        }
      }
    }
  }

  undo() {
    this.globalOperatorSrv.undo();
  }

  redo() {
    this.globalOperatorSrv.redo();
  }

  showQRCode() {
    if(this.storeSrv.remoteKey.value === '') {
      this.translate.get('REMOTE_ERROR').subscribe((res: string) => {
        this.globalOperatorSrv.createMessageBox().instance.error(res);
      });
      return;
    }
    if(this.isShowQRcode) return this.isShowQRcode = false;
    this.isShowQRcode = true;
  }

  copyQRcodeUrl() {
    this.copyTip = 'Copied';

    new window['ClipboardJS']('.btn-clipboard', {
      text: function () {
        return this.storeSrv.remoteKey.value;
      }.bind(this)
    });

    let timer = setTimeout(() => {
      this.copyTip = '';
      clearTimeout(timer);
    }, 3000);
  }

  showExample() {
    if(this.exampleVisibility) {
      this.exampleDetail = null;
      this.exampleVisibility = false;
      return;
    }
    this.exampleVisibility = true;
  }

  hideExample() {
    this.exampleDetail = null;
    this.exampleVisibility = false;
  }

  showExampleDetail(ev: MouseEvent, example) {
    ev.stopPropagation();
    ev.preventDefault();
    this.exampleDetail = example;
  }

  runExample(ev: MouseEvent) {
    ev.stopPropagation();
    ev.preventDefault();
    if(this.exampleDetail === null) return;
    this.storeSrv.loddingMODE.next(false);
    this.uploadSrv.loadExample(this.exampleDetail.file).subscribe((res: any) => {
      let data = res;
      try {
        this.globalOperatorSrv.openM5F(data);
        this.storeSrv.setProjectName(this.exampleDetail.title);
      } 
      catch (err) {
        console.log(err);
        try {
          this.globalOperatorSrv.openOldM5F(data);
          this.storeSrv.setProjectName(this.exampleDetail.title);
        } 
        catch(err) {
          console.log(err)
        }
      }
      finally {
        this.exampleDetail = null;
        this.exampleVisibility = false;
      }
    }, err => {
      this.storeSrv.loddingMODE.next(false);
    }, () => {
      this.storeSrv.loddingMODE.next(false);
    });
  }

  stopPropagation(ev: MouseEvent) {
    ev.stopPropagation();
    ev.preventDefault();
  }
}
