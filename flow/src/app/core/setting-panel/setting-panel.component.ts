import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { LANG } from 'src/app/utils/common-data';
import { GlobalOperatorService } from 'src/app/services/global-operator.service';
import { StoreService } from 'src/app/services/store.service';
import { Observable } from 'rxjs';
import { UploadService } from 'src/app/services/upload.service';
import { TranslateService } from '@ngx-translate/core';
import { BlocklyEditorService } from 'src/app/services/blockly-editor.service';

@Component({
  selector: 'app-setting-panel',
  templateUrl: './setting-panel.component.html',
  styleUrls: ['./setting-panel.component.scss']
})
export class SettingPanelComponent implements OnInit {

  @ViewChild('apikeyBox') apikeyBox: ElementRef;

  languageList = LANG;
  show: boolean;
  allapikey: Array<any> = [];
  apikey$: Observable<string>;
  defineType: string;
  categoryArr: Array<any> = ['core', 'stick'];
  constructor(
    private globalOperatorSrv: GlobalOperatorService,
    public storeSrv: StoreService,
    private uploadSrv: UploadService,
    private translateSrv: TranslateService,
    private blocklyEditorSrv: BlocklyEditorService
  ) { }

  ngOnInit() {
    this.defineType = localStorage.getItem('_type') || 'core';
    this.apikey$ = this.storeSrv.getApikey();
    setTimeout(() => {
    this.allapikey = this.storeSrv.getAllkey(); 
    }, 0);
  }

  ok(apikey, lang, cate) {
    if (this.storeSrv.apiKey.value !== apikey) {
      this.storeSrv.setApikey(apikey);
      this.storeSrv.setAllkey(apikey);
      this.uploadSrv.getDeviceInfo().subscribe();

    }
    if (this.storeSrv.defaultLanguage !== lang) {
      this.storeSrv.loddingMODE.next(true);
      const xml = window['Blockly'].Xml.workspaceToDom(window['BlocklyEditor']);
      const xml_text = window['Blockly'].Xml.domToText(xml);
      window.sessionStorage.setItem('xml', xml_text);

      this.storeSrv.setLanguage(lang);
      this.blocklyEditorSrv.init({ language: lang, wrapperId: 'wrapper_blockly_editor', toolboxId: 'wrapper_blockly_toolbox' });
      this.translateSrv.use(lang);
      // 延时1S 解决语言切换后units Blockly显示不出来
      setTimeout(() => {
        this.storeSrv.componentList.next(this.storeSrv.componentList.value);
        this.storeSrv.unitList.next(this.storeSrv.unitList.value);
      }, 1000);        
    }
    // this.storeSrv.getType().subscribe( res => {
    //   console.log(res);
    // });
    if (localStorage.getItem('_type') !== cate) {
      // this.storeSrv.loddingMODE.next(true);
      this.storeSrv.setType(cate);
      localStorage.setItem('_type', cate);
    }
    this.globalOperatorSrv.maskModal.instance.removeMask();
  }

  cancel() {
    this.globalOperatorSrv.maskModal.instance.removeMask();
  }

  enter(ev: KeyboardEvent, apikey, lang, cate) {
    if (ev.keyCode === 13) {
      return this.ok(apikey, lang, cate);
    }
  }

  convertUpperCase(ev) {
    this.apikeyBox.nativeElement.value = ev.target.value.toUpperCase();
  }
  apifocus() {
    this.show = true;
  }
  apiblur() {
    this.show = false;
  }
  selectapi(e) {
    this.apikeyBox.nativeElement.value = e.toUpperCase();
  }
  settheme(e) {
    if ( document.documentElement.hasAttribute('theme')) {
      document.documentElement.removeAttribute('theme');
    }
    document.documentElement.setAttribute('theme', e);
    localStorage.setItem('theme', e);
  }
}
