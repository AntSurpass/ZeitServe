import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { timeout, tap } from 'rxjs/operators';
import { StoreService } from './store.service';
import { CONNECT_STATUS, MESSAGE_TYPE } from '../utils/common-data';
import { Observable, OperatorFunction, Subject } from 'rxjs';
import { GlobalOperatorService } from './global-operator.service';
import { TranslateService } from '@ngx-translate/core';

export interface DeviceData {
  code: number;
  error?: string;
  data?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  /** 请求锁 */
  private _locker = false;

  constructor(private http: HttpClient, private storeSrv: StoreService, private globalOperatorSrv: GlobalOperatorService, private translate: TranslateService) { }

  private checkApikeyNull() {
    if(this.storeSrv.apiKey.value === '') {
      return true;
    }
    return false;
  }

  /** 释放请求锁 */
  releaseLocker(): OperatorFunction<any, any> {
    return tap(data => {
      this._locker = false;
      return data;
    }, err => {
      this._locker = false;
      return err;
    })
  }

  /**
   * 获取设备数据
   */
  getDeviceInfo(): Observable<any> {
    if(this.checkApikeyNull()) return Observable.create(observer => observer.next(false));
    this.translate.get('CONNECT_LOADING').subscribe((res: string) => {
      this.globalOperatorSrv.createMessageBox().instance.loading(res);
    });
    this.storeSrv.connectStatus = CONNECT_STATUS.CONNECTING;
    return this.http.get<DeviceData>(`${ environment.apiUrl }/${ this.storeSrv.apiKey.value }/getFlowInfo`).pipe(
      timeout(10000),
      tap(res => {
        if(res.code === 0) {
          this._locker = false;

          window['Blockly']['ResImages'] = res.data[2].filter(img => /.jpg/g.test(img));

          let _data = Object.assign(res.data);
          _data[2].splice(_data[2].findIndex(f => f === 'mix.wav'), 1);
          _data[2].splice(_data[2].findIndex(f => f === 'default.jpg'), 1);
          _data[2] = _data[2].map(f => {
            return { filename: f, base64: '' };
          });
          res.data = _data;

          this.translate.get('CONNECTED').subscribe((res: string) => {
            this.globalOperatorSrv.createMessageBox().instance.success(res);
          });

          if (res.data[0] !== this.storeSrv.VERSION) {
            setTimeout(() => {
              this.translate.get('FIRMWARE_WARNING', {value: this.storeSrv.VERSION }).subscribe((res: string) => {
                this.globalOperatorSrv.createMessageBox().instance.warning(res);
              });
            }, 1000);
          }

          this.storeSrv.connectStatus = CONNECT_STATUS.CONNECTED;
          this.storeSrv.setDeviceInfo({ version: _data[0], blocklys: _data[1], resources: _data[2] });
          return res;
        }

        this.storeSrv.connectStatus = CONNECT_STATUS.DISCONNECTED;
        this.storeSrv.setDeviceInfo(null);
        return res;
      }, err => {
        this._locker = false;
        
        this.storeSrv.connectStatus = CONNECT_STATUS.DISCONNECTED;
        this.storeSrv.setDeviceInfo(null);
      }, () => {
        this._locker = false;
      })
    );
  }

  /**
   * 获取设备状态
   */
  getDeviceStatus() {
    if(this.checkApikeyNull()) return Observable.create(observer => observer.next(false));
    this.translate.get('CONNECT_LOADING').subscribe((res: string) => {
      this.globalOperatorSrv.createMessageBox().instance.loading(res);
    });
    this.storeSrv.connectStatus = CONNECT_STATUS.CONNECTING;
    return this.http.get<DeviceData>(`${ environment.apiUrl }/${ this.storeSrv.apiKey.value }/isHardwareConnected`).pipe(
      timeout(10000),
      tap(res => {
        setTimeout(() => {
         if (res.data as any !== this.storeSrv.VERSION) {
            this.translate.get('FIRMWARE_WARNING', {value: this.storeSrv.VERSION }).subscribe((res: string) => {
              this.globalOperatorSrv.createMessageBox().instance.warning(res);
            });
          }
        }, 1000);
        if (res.code === 0 && res.data !== <any>false) {
          this.storeSrv.connectStatus = CONNECT_STATUS.CONNECTED;
        } else {
          this.translate.get('EXECUTECODE_ERROR').subscribe((res: string) => {
            this.globalOperatorSrv.createMessageBox().instance.error(res);
          });
          this.storeSrv.connectStatus = CONNECT_STATUS.DISCONNECTED;
        }

        return res.code === 0 && res.data !== <any>false;
      }, err => {
        this.translate.get('EXECUTECODE_ERROR').subscribe((res: string) => {
          this.globalOperatorSrv.createMessageBox().instance.error(res);
        });
        this.storeSrv.connectStatus = CONNECT_STATUS.DISCONNECTED;

        
      }),
      this.releaseLocker()
    );
  }

  /** 
   * 执行代码 
   */
  execCode(code) {
    if(this.checkApikeyNull()) return Observable.create(observer => observer.next(false));
    if(this._locker) return new Subject();
    this._locker = true;

    return this.http.post(`${ environment.apiUrl }/${ this.storeSrv.apiKey.value }/exec`, code).pipe(
      this.releaseLocker()
    );
  }

  /**
   * 上传资源文件
   * @param file 文件
   */
  uploadImg(file) {
    if(this.checkApikeyNull()) return Observable.create(observer => observer.next(false));
    if(this._locker) return new Subject();
    this._locker = true;

    const req = new HttpRequest('POST', `${ environment.apiUrl }/${ this.storeSrv.apiKey.value }/root/flash/res/${ file.name }`, file, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req).pipe(
      this.releaseLocker()
    );
  }

  /**
   * 移除资源文件
   * @param filename 文件名
   */
  deleteImg(filename) {
    if(this.checkApikeyNull()) return Observable.create(observer => observer.next(false));
    if(this._locker) return new Subject();
    this._locker = true;

    return this.http.delete(`${ environment.apiUrl }/${ this.storeSrv.apiKey.value }/root/flash/res/${ filename }`).pipe(
      this.releaseLocker()
    );
  }

  /**
   * 预加载设备资源
   * @param filename 文件名
   */
  reloadImg(filename) {
    if(this.checkApikeyNull()) return Observable.create(observer => observer.next(false));
    if(this._locker) return new Subject();
    this._locker = true;

    return this.http.get(`${ environment.apiUrl }/${ this.storeSrv.apiKey.value }/fs/flash/res/${ filename }`).pipe(
      this.releaseLocker()
    );
  }

  /**
   * 上传代码前执行
   */
  beforeUploadCode() { 
    let code = [
      'lcd.font(lcd.FONT_DejaVu24)',
      'lcd.setTextColor(0xffffff,0x30A9DE)',
      'lcd.fillRoundRect(40,90,240,60,10,0x30A9DE)',
      'lcd.print("Uploading...",86,110)',
    ];
    return this.execCode(code.join('\n'));
  }

  /**
   * 上传代码
   * @param code 代码
   */
  uploadCode(code) {
    if(this.checkApikeyNull()) return Observable.create(observer => observer.next(false));
    if(this._locker) return new Subject();
    this._locker = true;

    return this.http.post(`${ environment.apiUrl }/${ this.storeSrv.apiKey.value }/root/flash/apps/${ this.storeSrv.projectName.value }.py`, code, { responseType: 'text' }).pipe(
      this.releaseLocker()
    );
  }

  /**
   * 上传代码后执行
   */
  afterUploadCode() {
    let code = [
      'lcd.font(lcd.FONT_DejaVu24)',
      'lcd.setTextColor(0xffffff,lcd.ORANGE)',
      'lcd.fillRoundRect(40,90,240,60,10,lcd.ORANGE)',
      'lcd.print("Reseting...",86,110)',
      'from utils import filecp',
      `filecp('apps/${ this.storeSrv.projectName.value }.py', 'main.py')`,
      `core_start('app')`,
      'machine.reset()'
    ];
    return this.execCode(code.join('\n'));
  }

  /** 
   * 保存Blockly 
   * @param blocklyData Blockly数据
   */
  saveBlocklyFile(blocklyData) {
    return this.http.post(`${ environment.apiUrl }/${ this.storeSrv.apiKey.value }/root/flash/blocks/${ this.storeSrv.projectName.value }.m5f`, blocklyData, { responseType: 'text' });
  }

  /**
   * 读取Blockly数据
   * @param filename 文件名
   */
  loadBlocklyFile(filename) {
    return this.http.get(`${ environment.apiUrl }/${ this.storeSrv.apiKey.value }/root/flash/blocks/${ filename }`);
  }

  /**
   * 移除Blockly文件
   * @param filename 文件名
   */
  deleteBlocklyFile(filename) {
    return this.http.delete(`${ environment.apiUrl }/${ this.storeSrv.apiKey.value }/root/flash/blocks/${ filename }`);
  }

  /**
   * 获取遥控Key
   * @param remoteData 遥控数据
   */
  getRemoteKey(remoteData) {
    if(this.checkApikeyNull()) return Observable.create(observer => observer.next(false));
    if(this._locker) return new Subject();
    this._locker = true;

    return this.http.post(`${ environment.apiUrl }/${ this.storeSrv.apiKey.value }/remotor`, remoteData).pipe(
      this.releaseLocker()
    );
  }

  /**
   * 装载例程
   * @param exampleName 例程名称
   */
  loadExample(exampleName) {
    return this.http.get(`assets/examples/${ exampleName }`);
  }
}
