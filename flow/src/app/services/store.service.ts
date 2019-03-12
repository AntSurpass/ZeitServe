import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { BaseComponent } from '../domain/component';
import { BaseUnit } from '../domain/unit';
import { CONNECT_STATUS, LANG, LOCALSTORAGE_KEY } from '../utils/common-data';

export interface DeviceInfo {
  version: string;
  blocklys: string[];
  resources: FileData[];
}

export interface FileData {
  filename: string,
  base64: string
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {

   public isPhone;
  /** 版本号 */
  public VERSION = 'V1.2.2';
 
  /** 设备Id */
  public apiKey = new BehaviorSubject<string>(localStorage.getItem(LOCALSTORAGE_KEY.API_KEY) || '');

    /** 设备类型  core stick */
  public type = new BehaviorSubject<string>(localStorage.getItem('_type') || 'core');

  /** 默认语言 */
  public defaultLanguage = localStorage.getItem(LOCALSTORAGE_KEY.LANGUAGE) || LANG[0].file;

  /** 连接状态 */
  public connectStatus = CONNECT_STATUS.DISCONNECTED;

  /** 项目名称 */
  public projectName = new BehaviorSubject<string>('main');

  /** 遥控码 */
  public remoteKey = new BehaviorSubject<string>('');

  /** 设备数据 */
  public deviceInfo = new BehaviorSubject<DeviceInfo>(null);

  /** 工作区已存在的组件队列 */
  public componentList = new BehaviorSubject<BaseComponent[]>([]);

  /** 已添加的Units */
  public unitList = new BehaviorSubject<BaseUnit[]>([]);

  public hiddenBlockly = new Subject();

   /** loadding */
  public loddingMODE = new Subject();

    /** ui editor */
    public uieditorMode = new Subject();

    /** 二维吗 */
  public erweima = new BehaviorSubject<boolean>(false);

  constructor() { }

  /**
   * 获取所有组件
   */

  getComponentList() {
    return this.componentList.asObservable();
  }

  getUnitList() {
    return this.unitList.asObservable();
  }

  setHiddenBlockly() {
    return this.hiddenBlockly.asObservable();
  }
  showerweima() {
    return this.erweima.asObservable();
  }

  getuiMode() {
    return this.uieditorMode.asObservable();
  }
  /**
   * Loading UI
   */
  setLoddingMode() {
    return this.loddingMODE.asObservable();
  }

  /** 获取设备类型 */
  getType() {
    return this.type.asObservable();
  }

  setType(tp) {
    this.type.next(tp);
  }
  /**
   * 添加组件到工作区
   * @param component 组件实例
   */
  addComponent(component: BaseComponent) {
    this.componentList.next(this.componentList.value.concat(component));
    window['Blockly'].Component = this.componentList.value;
  }

  /**
   * 根据组件Id移除工作区组件
   * @param id 组件Id
   */
  removeComponentById(id: string) {
    this.componentList.value.splice(this.componentList.value.findIndex(c => c.id === id), 1)
    this.componentList.next(this.componentList.value);
  }

  removeComponentAll() {
    this.componentList.value.splice(0, this.componentList.value.length);
    this.componentList.next([]);
  }

  /**
   * 根据组件Id查询组件
   * @param id 组件Id
   */
  getComponentById(id: string) {
    let component = null;
    this.componentList.value.forEach(c => {
      if (c.id === id) {
        component = c;
      }
    });
    return component;
  }

  /**
   * 获取组件默认名称
   * @param type 组件类型
   */
  getComponentDefaultName(type: string) {
    let count = 0;
    this.componentList.value.forEach(c => c.type === type && count++);
    return type + count;
  }

  /**
   * 获取组件默认图层
   */
  getComponentDefaultLayer() {
    return this.componentList.value.length + 1 - 4;
  }

  /**
   * 添加Unit
   * @param unit Unit实例
   */
  addUnit(unit: BaseUnit) {
    
    this.unitList.next(this.unitList.value.concat(unit));
    
    window['Blockly'].Units = this.unitList.value;
  }

  /**
   * 根据Unit Id移除Unit
   * @param id Unit Id
   */
  removeUnitById(id: string) {
    this.unitList.value.splice(this.unitList.value.findIndex(u => u.id === id), 1);
    this.unitList.next(this.unitList.value);
  }

  /**
   * 获取Unit默认名称
   * @param type Unit类型
   */
  getUnitDefauleName(type: string) {
    let count = 0;
    this.unitList.value.forEach(u => u.type === type && count++);
    if (type === 'button') {
      type = 'btn';
    } else if (type === 'dual_button') {
      type = 'dual_btn';
    }
    return type + count;
  }

  /**
   * 设置设备数据
   * @param data 设备数据
   */
  setDeviceInfo(data: DeviceInfo) {
    this.deviceInfo.next(data);
  }

  /**
   * 获取设备数据
   */
  getDeviceInfo() {
    return this.deviceInfo.asObservable();
  }

  /** 设置api key */
  setApikey(key: string) {

    this.apiKey.next(key);
    localStorage.setItem(LOCALSTORAGE_KEY.API_KEY, key);

  }

  /** 获取api key */
  getApikey() {
    return this.apiKey.asObservable();
  }
/** 设置缓存api key*/
  setAllkey (key) {
    const a = JSON.parse(localStorage.getItem('AllAPIKEY')) || [];
    if (a.length > 4) {
      a.shift();
    }
    a.push(key);
    localStorage.setItem('AllAPIKEY', JSON.stringify(a));
  }
  /** 获取缓存 api key */
  getAllkey() {
    return JSON.parse(localStorage.getItem('AllAPIKEY')) || [];
  }
  /** 设置语言 */
  setLanguage(lang: string) {
    this.defaultLanguage = lang;
    localStorage.setItem(LOCALSTORAGE_KEY.LANGUAGE, lang);
  }


  /** 设置项目名 */
  setProjectName(name: string) {
    this.projectName.next(name);
  }

  /** 获取项目名 */
  getProjectName() {
    return this.projectName.asObservable();
  }

  /** 设置遥控码 */
  setRemoteKey(key) {
    this.remoteKey.next(key);
  }

  /** 获取遥控码 */
  getRemoteKey() {
    return this.remoteKey.asObservable();
  }
}
