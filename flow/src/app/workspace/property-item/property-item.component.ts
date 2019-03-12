import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { StoreService, DeviceInfo } from 'src/app/services/store.service';
import { Observable } from 'rxjs';
import { UploadService } from 'src/app/services/upload.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-property-item',
  templateUrl: './property-item.component.html',
  styleUrls: ['./property-item.component.scss']
})
export class PropertyItemComponent implements OnInit {

  @Input('propertyItem') propertyItem;

  @Output('changePropertyEmitter') changePropertyEmitter = new EventEmitter();

  @Output('updateImgEmitter') updateImgEmitter = new EventEmitter();

  @Output('changeToDefaultImgEmitter') changeToDefaultImgEmitter = new EventEmitter();

  @ViewChild('selectBox') selectBox: ElementRef;

  key: string = 'Unknow';

  value: string = 'Null';

   name: string = "Null";
  deviceInfo$: Observable<DeviceInfo>;

  loadingText = 'Reload';

  ispatten = false;

  toLoadImg = '';

  constructor(private storeSrv: StoreService, private uploadSrv: UploadService,
    private translate: TranslateService) { }

  ngOnInit() {
    this.deviceInfo$ = this.storeSrv.getDeviceInfo();

    for(let key in this.propertyItem) {
      this.key = key;
      this.value = this.propertyItem[key]
      
      this.translate.get(key).subscribe((res: string) => {
      this.name = res;
      });
    }
  }

  changePropertyEvent(ev) {
    
    console.log(this.key);
    
    if(this.key === 'name') {
      let patten = /^\w+$/ig;
      let trues =  patten.test(ev.target.value);
      if (trues) {
        this.ispatten = false;
      } else {
        this.ispatten = true;
        return;
      }
    } else if(this.key === 'x' || this.key === 'y' || this.key === 'width' || this.key === 'height' || this.key === 'layer' || this.key === 'radius') {
      let patten = /^[0-9]+$/ig;
      let trues =  patten.test(ev.target.value);
      if (trues) {
        this.ispatten = false;
      } else {
        this.ispatten = true;
        return;
      }
    }
    
    if(typeof ev === 'string') {
      return this.changePropertyEmitter.emit({
        key: this.key,
        value: ev,
        obj: null
      });
    }
    this.changePropertyEmitter.emit({
      key: this.key,
      value: ev.target.value,
      obj: ev
    });

    if(this.key === 'imagePath') {
      this.toLoadImg = ev.target.value;
      this.loadImg();
    }
  }

  loadImg() {
    if(this.selectBox.nativeElement.value === 'default.jpg') {
      this.changeToDefaultImgEmitter.emit();
      return;
    }

    let deviceInfo = this.storeSrv.deviceInfo.value;

    let imageData = deviceInfo.resources.filter(f => f.filename === this.selectBox.nativeElement.value)[0].base64;
    if(imageData !== '') {
      this.updateImgEmitter.emit(imageData);
      return;
    }

    this.loadingText = 'Loading';
    this.uploadSrv.reloadImg(this.selectBox.nativeElement.value).subscribe(res => {
      if(res.code === 0 && res.data !== '' && res.type === 'base64') {
        let base64Data = res.data.replace('/\n/g', '');
        this.updateImgEmitter.emit(`data:image/jpg;base64,${base64Data}`);

        deviceInfo.resources = deviceInfo.resources.map(f => {
          if(f.filename === this.selectBox.nativeElement.value) {
            f.base64 = `data:image/jpg;base64,${base64Data}`;
          }
          return f;
        });
        this.storeSrv.setDeviceInfo(deviceInfo);
      }
      this.loadingText = 'Reload';
    }, err => {
      this.loadingText = 'Reload';
    });
  }

}
