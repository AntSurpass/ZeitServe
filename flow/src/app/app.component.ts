import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GlobalOperatorService, UploadService, StoreService } from './services/services.module';
import { CONNECT_STATUS } from './utils/common-data';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ZrenderHelperService } from './services/zrender-helper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isPhone = false;
  constructor(private globalOperatorSrv: GlobalOperatorService, private uploadSrv: UploadService, 
    private storeSrv: StoreService, private translate: TranslateService, private zrenderWorkspace: ZrenderHelperService) {
    let language = localStorage.getItem('mui_language') || 'en';
    translate.setDefaultLang('en');
    translate.use(language);
  }

  ngOnInit() {
    window['remoteURL'] = 'http://flow-remote.m5stack.com/';
    window['startClientWidth'] = document.body.clientWidth;

    window.onorientationchange = function(ev) {
      window['UIEditor'].resize();
      window['zrenderWorkspace'].redrawSvg();
    }
    window.onresize = function(ev) {
      // window['zrenderWorkspace'].redrawSvg();
      if(window['startClientWidth'] <= 1400 && document.body.clientWidth > 1400) {
        window['UIEditor'].resize();
      }
      else if(window['startClientWidth'] > 1400 && document.body.clientWidth <= 1400) {
        window['UIEditor'].resize();
      }
      window['startClientWidth'] = document.body.clientWidth;
    }
    if (environment.production) {
      window.onbeforeunload = function (e) {
        var e = window.event || e;
        e.returnValue = ("Do you sure close this page?");
      }
    }

    // this.uploadSrv.getDeviceInfo().subscribe(res => {      
    //   this.translate.get('EXECUTECODE_ERROR').subscribe((res: string) => {
    //     this.globalOperatorSrv.createMessageBox().instance.error(res);
    //   });
    //   try {
    //     if (res.data[0] !== this.storeSrv.VERSION) {
    //       this.translate.get('FIRMWARE_WARNING', {value: this.storeSrv.VERSION }).subscribe((res: string) => {
    //         this.globalOperatorSrv.createMessageBox().instance.warning(res);
    //       });
    //     }
    //   } catch (error) {
    //     console.log(error);
        
    //   }

    // }, err => {
    //   // this.translate.get('EXECUTECODE_ERROR').subscribe((res: string) => {
    //   //   this.globalOperatorSrv.createMessageBox().instance.error(res);
    //   // });
    // });

    if (/Android|iPhone|BlackBerry/i.test(navigator.userAgent)) {
      this.isPhone = true;
      this.globalOperatorSrv.ismb = true;
    }
    // 设置主题
    if ( document.documentElement.hasAttribute('theme')) {
      document.documentElement.removeAttribute('theme');
    }
    document.documentElement.setAttribute('theme', localStorage.getItem('theme'));
    
  }

  stopPropagation(ev) {
    if (/Android|webOS|iPad|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    } else {
      this.globalOperatorSrv.setSelectedComponent(null);
      this.globalOperatorSrv.setSelectedUnit(null);
    }
  }
}
