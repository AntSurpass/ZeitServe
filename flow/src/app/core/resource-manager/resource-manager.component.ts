import { Component, OnInit } from '@angular/core';
import { GlobalOperatorService } from 'src/app/services/global-operator.service';
import { StoreService, DeviceInfo } from 'src/app/services/store.service';
import { Observable } from 'rxjs';
import { UploadService } from 'src/app/services/upload.service';
import { HttpEvent } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-resource-manager',
  templateUrl: './resource-manager.component.html',
  styleUrls: ['./resource-manager.component.scss']
})
export class ResourceManagerComponent implements OnInit {

  selectedFileType = 'images';

  deviceInfo$: Observable<DeviceInfo>;

  uploadingFile: string = '';

  uploading: boolean = false;

  constructor(
    private globalOperatorSrv: GlobalOperatorService,
    private storeSrv: StoreService,
    private uploadSrv: UploadService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    
    this.deviceInfo$ = this.storeSrv.getDeviceInfo();
  }

  refresh() {
    this.uploadSrv.getDeviceInfo().subscribe();
  }

  cancel() {
    this.globalOperatorSrv.maskModal.instance.removeMask();
  }

  selectFile(type) {
    this.selectedFileType = type;
  }

  uploadImgHandler() {
    let uploadImgBox = document.getElementById('__uploadImgBox');
    uploadImgBox.click();
    uploadImgBox.onchange = (ev) => {
      // 是否没有选择文件
      if (ev.target['files'].length === 0) {
        ev.target['value'] = '';
        this.globalOperatorSrv.createMessageBox().instance.error('');
        return;
      }
      // 是否超出25kb
      if (ev.target['files'][0].size > 25 * 1000) {
        ev.target['value'] = '';
        this.translate.get('FILE_SIZE_ERROR').subscribe((res: string) => {
          this.globalOperatorSrv.createMessageBox().instance.error(res);
        });
        return;
      }
      // 文件名长度是否大于10
      if (ev.target['files'][0].name.replace(/.jpg|.bmp/g, '').length > 10) {
        ev.target['value'] = '';
        this.translate.get('FILE_NAME_EROR').subscribe((res: string) => {
          this.globalOperatorSrv.createMessageBox().instance.error(res);
        });
        return;
      }

      this.uploadingFile = ev.target['files'][0].name;
      this.uploading = true;
      let _file = ev.target['files'][0];
      this.uploadSrv.uploadImg(ev.target['files'][0]).subscribe((event) => {
        if(event.status === 200) {
          let fr = new FileReader();
          let _this = this;
          fr.onload = function() {
            let deviceInfo = _this.storeSrv.deviceInfo.value;
            let flag = deviceInfo.resources.filter(f => f.filename === _file.name);
            if(flag.length === 0) {
              deviceInfo.resources.push({ filename: _file.name, base64: this.result.toString() });
            } else {
              deviceInfo.resources.forEach(f => {
                if(f.filename === _file.name) {
                  f.base64 = this.result.toString();
                }
              });
            }
            _this.storeSrv.setDeviceInfo(deviceInfo);
          }
          fr.readAsDataURL(_file);
          
          ev.target['value'] = '';
          this.uploadingFile = '';
          this.uploading = false;
        }
      }, err => {
        ev.target['value'] = '';
        this.uploadingFile = '';
        this.uploading = false;
      });
    }
  }

  deleteImageHandler(filename) {
    if(!window.confirm('Do you sure remove this file from your device?')) return;
    this.uploadSrv.deleteImg(filename).subscribe(res => {
      let deviceInfo = this.storeSrv.deviceInfo.value;
      deviceInfo.resources.splice(deviceInfo.resources.findIndex(f => f.filename === filename), 1);
      this.storeSrv.setDeviceInfo(deviceInfo);
    }, err => {
      console.log(err);
    });
  }

  loadM5FHandler(filename) {
    this.uploadSrv.loadBlocklyFile(filename).subscribe(res => {
      let data = res;
      this.globalOperatorSrv.openM5F(data);
      this.cancel();
    });
  }

  deleteM5FHandler(filename) {
    if(!window.confirm('Do you sure remove this file?')) return;
    this.uploadSrv.deleteBlocklyFile(filename).subscribe(res => {
      let deviceInfo = this.storeSrv.deviceInfo.value;
      deviceInfo.blocklys.splice(deviceInfo.blocklys.findIndex(b => b === filename), 1);
      this.storeSrv.setDeviceInfo(deviceInfo);
    });
  }
}
