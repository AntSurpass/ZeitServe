import { Injectable, Component } from '@angular/core';
import { ToolItem, ToolBar } from '../domain/editor/UIEditorToolbar.class';
import { ZrenderHelperMbService } from './zrender-helper-mb.service';
import {
  ScreenComponent,
  ButtonComponent,
  ButtonIndex,
  TitleComponent,
  LabelComponent,
  RectangleComponent,
  CircleComponent,
  ImageComponent
} from '../domain/component';
import { StoreService } from './store.service';
import { ZrenderHelperService } from './zrender-helper.service';
import { GlobalOperatorService } from './global-operator.service';

@Injectable()
export class UiEditorService {

  /** 工具栏 */
  public toolBar: ToolBar;

  /** 工作区 */
  public workspace;

  public isStick;

  /** 根据设备选择不同服务渲染UI */
  public UIHELP;

  constructor(private zrenderHelperMb: ZrenderHelperMbService, private storeSrv: StoreService, private zenaderHelp: ZrenderHelperService,
    private globalStr: GlobalOperatorService) {
      if(this.globalStr.ismb) {
        this.UIHELP = this.zrenderHelperMb;
      } else {
        this.UIHELP = this.zenaderHelp;
      }
  }
  public init(wrapperId: string, Categroy: string) {
    if (Categroy === 'stick') {
      this.isStick = true;
    } else if (Categroy === 'core') {
      this.isStick = false;
    }
    if (this.UIHELP.zrenderWorkspace) {
      this.UIHELP.screenContainer.removeAll();
      this.UIHELP.zrenderWorkspace.refreshImmediately();
      this.storeSrv.removeComponentAll();
    }
    // this.UIHELP.zrenderWorkspace.removeAll();
    
    this.UIHELP.init(wrapperId);
    this.createToolbar();
    this.createSimulator();
    this.createMainEditArea();
    this.createDeleteArea();
    this.createUnitArea();
    this.initScene();

    window['UIEditor'] = this.UIHELP.zrenderWorkspace;
    this.workspace = this.UIHELP.zrenderWorkspace;
  }

  private createToolbar() {
    // 创建工具栏

    if (this.isStick) {
      const rectangleTool = new ToolItem({ icon: 'rectangle.jpg', builder: RectangleComponent });
      const labelTool = new ToolItem({ icon: 'label.jpg', builder: LabelComponent });
      this.toolBar = new ToolBar([rectangleTool, labelTool]);
    } else {
      const titleTool = new ToolItem({ icon: 'title.jpg', builder: TitleComponent });
      const labelTool = new ToolItem({ icon: 'label.jpg', builder: LabelComponent });
      const rectangleTool = new ToolItem({ icon: 'rectangle.jpg', builder: RectangleComponent });
      const circleTool = new ToolItem({ icon: 'circle.jpg', builder: CircleComponent });
      const imageTool = new ToolItem({ icon: 'image.jpg', builder: ImageComponent });
      this.toolBar = new ToolBar([titleTool, labelTool, rectangleTool, circleTool, imageTool]);
    }
    this.UIHELP.createToolBarSvg(this.toolBar);

  }

  private createSimulator() {
    // 创建M5模拟器
    if (this.isStick) {
      this.UIHELP.creatM5stickSimulator();
    } else {
      this.UIHELP.createSimulator();
    }
  }

  private createMainEditArea() {
    // 创建主编辑区域
    this.UIHELP.createMainEditArea();
  }

  private createDeleteArea() {
    // 创建移除区域
    this.UIHELP.createDeleteArea();
  }

  private createUnitArea() {
    // 创建Unit区域
    this.UIHELP.createUnitArea();
  }

  private initScene() {
    // 初始化场景
    if (this.isStick) {
      /** stickScreen */
      const screen = new ScreenComponent({
        id: '_stickscreen',
        width: 128,
        height: 256,
        x: 0,
        y: 0,
        backgroundColor: '#111111'
      });
      this.UIHELP.screenContainer.add(this.UIHELP.createComponentSvg(screen));
      this.storeSrv.addComponent(screen);
    } else {
      /** Screen */
      const screen = new ScreenComponent({});
      const buttonA = new ButtonComponent({
        buttonIndex: ButtonIndex.A,
        name: 'btnA'
      });
      const buttonB = new ButtonComponent({
        buttonIndex: ButtonIndex.B,
        name: 'btnB'
      });
      const buttonC = new ButtonComponent({
        buttonIndex: ButtonIndex.C,
        name: 'btnC'
      });

      this.UIHELP.screenContainer.add(this.UIHELP.createComponentSvg(screen));
      this.storeSrv.addComponent(screen);

      this.UIHELP.screenContainer.add(this.UIHELP.createComponentSvg(buttonA));
      this.storeSrv.addComponent(buttonA);

      this.UIHELP.screenContainer.add(this.UIHELP.createComponentSvg(buttonB));
      this.storeSrv.addComponent(buttonB);

      this.UIHELP.screenContainer.add(this.UIHELP.createComponentSvg(buttonC));
      this.storeSrv.addComponent(buttonC);



    }
    this.UIHELP.updateUnitSvg();
  }
}
