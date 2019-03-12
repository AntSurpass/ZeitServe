import { Injectable, ApplicationRef, ComponentFactoryResolver, Injector, ComponentRef } from '@angular/core';
import { MODE, TYPE_ALIAS } from '../utils/common-data';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseComponent, ScreenComponent } from '../domain/component';
import { BaseUnit } from '../domain/unit';
import { StoreService } from './store.service';
import { rebuildComponentInstance, rebuildUnitInstance, updateOldComponent, updateOldUnit } from '../utils/common-tool';
import { MessageBoxComponent } from '../shared/message-box/message-box.component';
import { ZrenderHelperService } from './zrender-helper.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalOperatorService {

  /** 编辑模式 */
  mode = new BehaviorSubject<string>(MODE.BLOCKLY);

  /** 代码锁 */
  codeLock = new BehaviorSubject<boolean>(false);

  /** UI模拟器可见性 */
  UIVisibility = new BehaviorSubject<boolean>(true);

  /** 已选中组件 */
  selectedComponent = new BehaviorSubject<BaseComponent>(null);

  /** 已选中Unit */
  selectedUnit = new BehaviorSubject<BaseUnit>(null);

  /** 遮盖层Modal */
  maskModal: ComponentRef<any> = null;

  /** 提示语组件 */
  messageBox: ComponentRef<MessageBoxComponent> = null;

  /** 移动设备检测 */
   ismb: Boolean = false;
  constructor(
    private appRef: ApplicationRef,
    private cfr: ComponentFactoryResolver,
    private injector: Injector,
    private storeSrv: StoreService
  ) { 
    
  }

  /**
   * 设置工作区模式
   * @param mode 模式
   */
  setMode(mode: string) {
    this.mode.next(mode);
  }

  /**
   * 获取工作区模式流
   */
  getMode(): Observable<string> {
    return this.mode.asObservable();
  }

  /**
   * 设置UI工作区可见性
   * @param visibility 是否可见
   */
  setUIVisibility(visibility: boolean) {
    this.UIVisibility.next(visibility);
    window['BlocklyEditor'].resize();
    let _timeout = setTimeout(() => {
      var e = document.createEvent("Event");
      e.initEvent("resize", true, true);
      window.dispatchEvent(e);
      clearTimeout(_timeout);
    });
  }

  /**
   * 获取UI工作区可见性
   */
  getUIVisibility(): Observable<boolean> {
    return this.UIVisibility.asObservable();
  }

  /**
   * 设置已选中组件
   * @param component 组件实例
   */
  setSelectedComponent(component: BaseComponent) {
    if(component === this.selectedComponent.value) return this.selectedComponent.next(null);
    this.selectedComponent.next(component);
    this.selectedUnit.next(null);
  }

  /**
   * 获取已选中组件
   */
  getSelectedComponent(): Observable<BaseComponent> {
    return this.selectedComponent.asObservable();
  }

  /**
   * 设置已选中Unit
   * @param unit Unit实例
   */
  setSelectedUnit(unit: BaseUnit) {
    if(unit === this.selectedUnit.value) return this.selectedUnit.next(null);
    this.selectedUnit.next(unit);
    this.selectedComponent.next(null);
  }

  /**
   * 获取已选中Unit
   */
  getSelectedUnit() {
    return this.selectedUnit.asObservable();
  }

  /**
   * 创建Modal
   * @param maskComponent 遮盖层组件实例
   */
  createMaskModal(maskComponent) {
    let newNode = document.createElement('div');
    newNode.id = '____mask_modal';
    document.body.appendChild(newNode);

    const factory = this.cfr.resolveComponentFactory(maskComponent);
    let componentRef = factory.create(this.injector, [], newNode);
    componentRef.changeDetectorRef.detectChanges(); // Immediately change detection to avoid multi-checking error
    this.appRef.attachView(componentRef.hostView); // Load view into app root

    this.maskModal = componentRef;

    return componentRef;
  }

  /**
   * 创建MessageBox
   */
  createMessageBox() {
    let newNode = null;
    if(document.getElementById('____message_box') === null) {
      newNode = document.createElement('div');
      newNode.id = '____message_box';
      document.body.appendChild(newNode);
    } else {
      newNode = document.getElementById('____message_box');
    }

    const factory = this.cfr.resolveComponentFactory(MessageBoxComponent);
    
    let componentRef = factory.create(this.injector, [], newNode);

    
    componentRef.changeDetectorRef.detectChanges(); // Immediately change detection to avoid multi-checking error
    this.appRef.attachView(componentRef.hostView); // Load view into app root

    this.messageBox = componentRef;

    return componentRef;
  }

  /**
   * 设置代码锁
   * @param value 是否锁定代码
   */
  setCodeLock(value: boolean) {
    this.codeLock.next(value);
  }

  /**
   * 获取代码锁
   */
  getCodeLock() {
    return this.codeLock.asObservable();
  }

  /** 保存为m5f文件 */
  saveM5F() {
    window['Blockly'].Python.workspaceToCode(window['BlocklyEditor']);

    let data = {};
    data['components'] = this.storeSrv.componentList.value.map( c => {
      delete c['componentSvg'];
      return c;
    });
    data['units'] = this.storeSrv.unitList.value.map( u => {
      delete u['unitSvg'];
      return u;
    });
    data['blockly'] = window['Blockly'].Xml.workspaceToDom(window['BlocklyEditor']).innerHTML;
    data['Blockly.ButtonEvents'] = window['Blockly']['ButtonEvents'];
    data['Blockly.Remotes'] = window['Blockly']['Remotes'];
    data['modules'] = window['Blockly']['modules'];

    return data;
  }

  /**
   * 读取m5f文件
   * @param data m5f文件数据
   */
  openM5F(data) {
    const components = data['components'].map(c => {
      return rebuildComponentInstance(c);
    });

    let lackScreen = true;
    for(let i = 0; i < components.length; i++) {
      if(components[i].type === TYPE_ALIAS.SCREEN) {
        lackScreen = false;
      }
    }
    lackScreen ? components.unshift(new ScreenComponent({})) : null;

    const units = data['units'].map(u => {
      return rebuildUnitInstance(u);
    });

    this.storeSrv.componentList.next(components);
    this.storeSrv.unitList.next(units);

    window['Blockly']['Component'] = components;
    window['Blockly']['ButtonEvents'] = data['Blockly.ButtonEvents'];
    window['Blockly']['Remotes'] = data['Blockly.Remotes'];
    window['Blockly']['Units'] = units;
    window['Blockly']['modules'] = data['modules'] || [];

    window['BlocklyEditor'].clear();
    window['Blockly'].Xml.domToWorkspace(window['Blockly'].Xml.textToDom(`<xml>${ data['blockly'] }</xml>`), window['BlocklyEditor']);
    
    window['UIEditor'].redrawSvg();
    window['UIEditor'].screenContainer.__dirty = true;
    window['UIEditor'].refresh();
  }

  openOldM5F(data) {
    let newComponets = [];
    let newUnits = [];
    
    let buttons = data['components'].filter(c => {
      if(c.name) {
        return c.name === 'button0' || c.name === 'button1' || c.name === 'button2';
      }
    });

    let oldComponent = data['components'].slice();
    oldComponent.splice(oldComponent.findIndex(c => c.name === 'button0'), 1);
    oldComponent.splice(oldComponent.findIndex(c => c.name === 'button1'), 1);
    oldComponent.splice(oldComponent.findIndex(c => c.name === 'button2'), 1);

    newComponets.push(new ScreenComponent({}));
    buttons.forEach(b => {
      newComponets.push(updateOldComponent(b));
    });
    oldComponent.forEach(c => {
      newComponets.push(updateOldComponent(c));
    });

    data['units'].forEach(u => {
      newUnits.push(updateOldUnit(u));
    });

    this.storeSrv.componentList.next(newComponets);
    this.storeSrv.unitList.next(newUnits);

    window['Blockly']['Component'] = newComponets;
    window['Blockly']['ButtonEvents'] = data['Blockly.ButtonEvents'];
    window['Blockly']['Remotes'] = data['Blockly.Remotes'];
    window['Blockly']['Units'] = newUnits;
    window['Blockly']['modules'] = data['modules'] || [];

    window['BlocklyEditor'].clear();
    window['Blockly'].Xml.domToWorkspace(window['Blockly'].Xml.textToDom(`<xml>${ data['blockly'] }</xml>`), window['BlocklyEditor']);

    window['UIEditor'].redrawSvg();

    window['UIEditor'].screenContainer.__dirty = true;
    window['UIEditor'].refresh();
  }

  redo() {
    if(this.mode.value === MODE.BLOCKLY) {
      window['BlocklyEditor'].undo(1);
    } else {
      window['CodeEditor'].redo();
    }
  }

  undo() {
    if(this.mode.value === MODE.BLOCKLY) {
      if(window['BlocklyEditor'].undoStack_.length === 1) return;
      window['BlocklyEditor'].undo();
    } else {
      window['CodeEditor'].undo();
    }
  }
}
