import { Injectable } from '@angular/core';
import * as zrender from 'zrender';
import { ToolBar } from '../domain/editor/UIEditorToolbar.class';
import {
  BaseComponent,
  ScreenComponent,
  ButtonComponent,
  TitleComponent,
  LabelComponent,
  RectangleComponent,
  CircleComponent,
  ImageComponent
} from '../domain/component';
import { TYPE_ALIAS, COMPONENT_ALIAS, FONT_ALIAS, DYNAMIC_COMPONENT_TYPE } from '../utils/common-data';
import { StoreService } from '../services/store.service';
import { CodeEditorService } from './code-editor.service';
import { GlobalOperatorService } from './global-operator.service';
import { MaskComponent } from '../shared/mask/mask.component';

@Injectable({
  providedIn: 'root'
})
export class ZrenderHelperMbService {

  /** zrender画布 */
  zrenderWorkspace;

  /** 屏幕容器 */
  screenContainer;

  /** Unit容器 */
  unitContainer;

  /** 画布宽度 */
  width: number = 0;

  /** 画布高度 */
  height: number = 0;

  /** 屏幕X偏移量 */
  screenOffsetX: number = 70;

  /** 屏幕Y偏移量 */
  screenOffsetY: number = 165;

  /** 缩放系数 */
  scaleRatio: number = 1;

  /** 等比系数 */
  eRatio: number = 1;

  isStick: boolean = false;

  constructor(
    private storeSrv: StoreService,
    private codeEditorSrv: CodeEditorService,
    private globalOperatorSrv: GlobalOperatorService) {
    storeSrv.getType().subscribe(e => {
      if (e === 'stick') {
        this.isStick = true;
        this.screenOffsetX = 155;
        this.screenOffsetY = 24;
        this.eRatio = 0.5;
      } else if (e === 'core') {
        this.isStick = false;
        this.screenOffsetX = 150;
        this.screenOffsetY = 65;
        this.eRatio = 1;
      }
    });
  }

  /** 初始化zrender画布 */
  init(id: string) {
    let canvarsWapper = document.getElementById(id);
    this.zrenderWorkspace = zrender.init(canvarsWapper, { renderer: 'canvas' });
    
    this.width = this.zrenderWorkspace.getWidth();
    this.height = this.zrenderWorkspace.getHeight();
    
    
    this.scaleRatio = 0.65;
    window['zrenderWorkspace'] = this.zrenderWorkspace;
    this.zrenderWorkspace.redrawSvg = this.redrawSvg.bind(this);
    this.createComponentSvg = this.createComponentSvg.bind(this);
  }

  /**
   * 生成工具栏
   * @param toolBar 工具栏
   */
  createToolBarSvg(toolBar: ToolBar) {
    toolBar.toolList.forEach((toolItem, index) => {
      const g = new zrender.Group({});
      g.position = [0, index * 48 * this.scaleRatio];
      const img = new zrender.Image({
        style: {
          x: 0,
          y: 0,
          width: 48 * this.scaleRatio,
          height: 48 * this.scaleRatio,
          image: '../../assets/images/components/' + toolItem.icon
        },
        cursor: 'pointer',
        draggable: true
      });

      g.add(img);

      let _this = this;

      // 开始拖拽
      // 生成一个临时svg
      g.on('dragstart', function (ev) {
        
        ev.target.attr('position', [0, 0]);
        let component = new toolItem.builder({
          name: '__temp' + Date.now(),
          layer: 99999
        });
        const svg = _this.createComponentSvg(component);
        _this.zrenderWorkspace.add(svg);

        // 拖拽圆形
        if (component.type === TYPE_ALIAS.CIRCLE) {
          svg.attr('position', [ev.offsetX, ev.offsetY]);
        }
        // 拖拽标签
        else if (component.type === TYPE_ALIAS.LABEL) {
          let x = ev.offsetX - svg.getBoundingRect().width / 2 * _this.scaleRatio;
          let y = ev.offsetY - svg.getBoundingRect().height / 2 * _this.scaleRatio;
          svg.attr('position', [x, y]);
        }
        // 拖拽图片
        else if (component.type === TYPE_ALIAS.IMAGE) {
          let x = ev.offsetX - svg.style.width / 2 * _this.scaleRatio;
          let y = ev.offsetY - svg.style.height / 2 * _this.scaleRatio;
          svg.attr('position', [x, y]);
        }
        else {
          let x = ev.offsetX - component.width / 2 * _this.scaleRatio;
          let y = ev.offsetY - component.height / 2 * _this.scaleRatio;
          svg.attr('position', [x, y]);
        }

        this.__m5ui = {
          temp_component_svg: svg,
          temp_component: component
        };
      });
      // 拖拽结束
      // 清除临时svg
      g.on('dragend', function (ev) {
        _this.zrenderWorkspace.remove(this.__m5ui.temp_component_svg);
        if (_this.screenContainer.children()[0].contain(ev.event.layerX ? ev.event.layerX : ev.event.zrX , ev.event.layerY ? ev.event.layerY : ev.event.zrY)) {
          // 添加组件成功
          let defaultName = _this.storeSrv.getComponentDefaultName(this.__m5ui.temp_component.type);
          let defaultLayer = _this.storeSrv.getComponentDefaultLayer();
          if(_this.isStick) {
            defaultLayer += 3;
          }
          let component = null;
          switch (this.__m5ui.temp_component.type) {
            case TYPE_ALIAS.TITLE:
              component = new TitleComponent({
                name: defaultName,
                layer: defaultLayer
              });
              break;
            case TYPE_ALIAS.LABEL:
              component = new LabelComponent({
                name: defaultName,
                layer: defaultLayer,
                x: this.__m5ui.temp_component_svg.position[0] - _this.screenOffsetX * _this.scaleRatio,
                y: this.__m5ui.temp_component_svg.position[1] - _this.screenOffsetY * _this.scaleRatio,
              });
              break;
            case TYPE_ALIAS.RECTANGLE:
              component = new RectangleComponent({
                name: defaultName,
                layer: defaultLayer,
                x: (this.__m5ui.temp_component_svg.position[0] - _this.screenOffsetX * _this.scaleRatio),
                y: this.__m5ui.temp_component_svg.position[1] - _this.screenOffsetY * _this.scaleRatio,
              });
              break;
            case TYPE_ALIAS.CIRCLE:
              component = new CircleComponent({
                name: defaultName,
                layer: defaultLayer,
                x: this.__m5ui.temp_component_svg.position[0] - _this.screenOffsetX * _this.scaleRatio,
                y: this.__m5ui.temp_component_svg.position[1] - _this.screenOffsetY * _this.scaleRatio
              });
              break;
            case TYPE_ALIAS.IMAGE:
              component = new ImageComponent({
                name: defaultName,
                layer: defaultLayer,
                x: this.__m5ui.temp_component_svg.position[0] - _this.screenOffsetX * _this.scaleRatio,
                y: this.__m5ui.temp_component_svg.position[1] - _this.screenOffsetY * _this.scaleRatio
              });
              break;
          }

          // 重新绘图
          if (component === null) return;
          _this.createSvg(component);
          if (_this.isStick) {
            component.width = component.width / 2;
            component.height = component.height / 2;
            component.x = component.x / 2;
            component.y = component.y / 2;
          }
          _this.storeSrv.addComponent(component);
          if (!_this.globalOperatorSrv.codeLock.value) {
            _this.codeEditorSrv.updateWorkspaceValue();
          }
        }
      });
      // 拖拽
      g.on('drag', function (ev) {
        ev.target.attr('position', [0, 0]);
        let x = 0;
        let y = 0;
        // 拖拽圆形
        if (this.__m5ui.temp_component.type === TYPE_ALIAS.CIRCLE) {
          x = ev.offsetX;
          y = ev.offsetY;
          this.__m5ui.temp_component_svg.attr('position', [x, y]);
        }
        // 拖拽标签
        else if (this.__m5ui.temp_component.type === TYPE_ALIAS.LABEL) {
          x = ev.offsetX - this.__m5ui.temp_component_svg.getBoundingRect().width / 2 * _this.scaleRatio;
          y = ev.offsetY - this.__m5ui.temp_component_svg.getBoundingRect().height / 2 * _this.scaleRatio;
          this.__m5ui.temp_component_svg.attr('position', [x, y]);
        }
        // 拖拽图片
        else if (this.__m5ui.temp_component.type === TYPE_ALIAS.IMAGE) {
          x = ev.offsetX - this.__m5ui.temp_component_svg.style.width / 2 * _this.scaleRatio;
          y = ev.offsetY - this.__m5ui.temp_component_svg.style.height / 2 * _this.scaleRatio;
          this.__m5ui.temp_component_svg.attr('position', [x, y]);
        }
        else {
          x = ev.offsetX - this.__m5ui.temp_component.width / 2 * _this.scaleRatio;
          y = ev.offsetY - this.__m5ui.temp_component.height / 2 * _this.scaleRatio;
          this.__m5ui.temp_component_svg.attr('position', [x, y]);
        }
      });
      this.zrenderWorkspace.add(g);

    });
  }

  /** 生成模拟器 */
  createSimulator() {

    const g = new zrender.Group({});
    g.position = [120 * this.scaleRatio, 10 * this.scaleRatio];

    /** 外围 */
    const shell = new zrender.Rect({
      shape: {
        r: 24,
        x: 0,
        y: 0,
        width: 380 * this.scaleRatio,
        height: 380 * this.scaleRatio
      },
      style: {
        stroke: '#5A5A5A',
        lineWidth: 6
      },
      cursor: 'default'
    });

    /** 电池 */
    const power = new zrender.Rect({
      shape: {
        r: 10,
        x: -2 * this.scaleRatio,
        y: 100 * this.scaleRatio,
        width: 5 * this.scaleRatio,
        height: 40 * this.scaleRatio
      },
      style: {
        fill: 'red'
      },
      cursor: 'default'
    });

    g.add(shell);
    g.add(power);

    /** 按钮 */
    const buttons = [{ x: 70, y: 330 }, { x: 160, y: 330 }, { x: 250, y: 330 }];
    buttons.forEach((btn, index) => {

      const button = new zrender.Rect({
        shape: {
          r: 5,
          x: btn.x * this.scaleRatio,
          y: btn.y * this.scaleRatio,
          width: 56 * this.scaleRatio,
          height: 30 * this.scaleRatio
        },
        style: {
          fill: '#C2BFCB'
        }
      });

      let id = index === 0 ? '____buttonA' : index === 1 ? '____buttonB' : '____buttonC';

      button.on('click', ev => {
        const component = this.storeSrv.getComponentById(id);
        this.globalOperatorSrv.setSelectedComponent(component);
      });

      button.on('dblclick', ev => {
        // let blocks = window['BlocklyEditor'].getAllBlocks();
        // // const component = this.storeSrv.getComponentById(id);
        // // Blockly.Blocks['adc']
        // console.log(blocks);  
        let buttonBlock = window['BlocklyEditor'].newBlock('button_callback', window['Blockly'].utils.genUid());

        if (index === 0) {
          buttonBlock.inputList[0].fieldRow[1].text_ = 'A';
          buttonBlock.inputList[0].fieldRow[1].value_ = 'A';
          buttonBlock.moveBy(50, 100);
        } else if (index === 1) {
          buttonBlock.inputList[0].fieldRow[1].text_ = 'B';
          buttonBlock.inputList[0].fieldRow[1].value_ = 'B';
          buttonBlock.moveBy(50, 200);
        } else if (index === 2) {
          buttonBlock.inputList[0].fieldRow[1].text_ = 'C';
          buttonBlock.inputList[0].fieldRow[1].value_ = 'C';
          buttonBlock.moveBy(50, 300);
        }
        buttonBlock.getRelativeToSurfaceXY(); // 得到块位置
        buttonBlock.initSvg();
        buttonBlock.render();
      });

      g.add(button);

    });

    /** Port口 */
    const ports = [
      { x: -26, y: 230, width: 12, height: 60, fillColr: '#c03546' },
      { x: 110, y: -26, width: 60, height: 12, fillColr: '#5e5e5f' },
      { x: 210, y: -26, width: 60, height: 12, fillColr: 'rgb(0, 160, 200)' }
    ];
    ports.forEach(p => {

      const port = new zrender.Rect({
        shape: {
          x: p.x * this.scaleRatio,
          y: p.y * this.scaleRatio,
          width: p.width * this.scaleRatio,
          height: p.height * this.scaleRatio
        },
        style: {
          fill: p.fillColr,
          opacity: 0
        }
      });

      g.add(port);

    });

    this.zrenderWorkspace.add(g);
  }

  /** M5stick模拟器 */

  creatM5stickSimulator() {
    const g = new zrender.Group({});
    g.position = [120 * this.scaleRatio, 10 * this.scaleRatio];

    /** 外圈 */
    const shell = new zrender.Rect({
      shape: {
        r: 10,
        x: 0,
        y: 0,
        width: 200 * this.scaleRatio,
        height: 400 * this.scaleRatio
      },
      style: {
        stroke: '#666',
        fill: '#444',
        lineWidth: 2
      },
      cursor: 'default'
    });
    /** 电池 */
    const power = new zrender.Rect({
      shape: {
        r: 10,
        x: -2 * this.scaleRatio,
        y: 320 * this.scaleRatio,
        width: 5 * this.scaleRatio,
        height: 40 * this.scaleRatio
      },
      style: {
        fill: 'red'
      },
      cursor: 'default'
    });

    /** 复位 */
    const reset = new zrender.Rect({
      shape: {
        r: 10,
        x: 198 * this.scaleRatio,
        y: 100 * this.scaleRatio,
        width: 5 * this.scaleRatio,
        height: 40 * this.scaleRatio
      },
      style: {
        fill: '#ccc'
      },
      cursor: 'default'
    });

    /** 红外感应 */
    const induction = new zrender.Rect({
      shape: {
        r: 10,
        x: 25 * this.scaleRatio,
        y: -2 * this.scaleRatio,
        width: 14 * this.scaleRatio,
        height: 5 * this.scaleRatio
      },
      style: {
        fill: '#ccc'
      },
      cursor: 'default'
    });
    /** m5logo */

    const text = new zrender.Text({
      position: [40 * this.scaleRatio, 320 * this.scaleRatio],
      style: {
        text: 'M5',
        fontWeight: 700,
        fontSize: 70 * this.scaleRatio,
        textFill: '#ccc'
      },
      cursor: 'default'
    });

    g.add(shell);
    g.add(power);
    g.add(text);
    g.add(reset);
    g.add(induction);
    this.zrenderWorkspace.add(g);
  }


  /** 创建主编辑区域 */
  createMainEditArea() {

    const g = new zrender.Group({

    });
    g.position = [this.screenOffsetX * this.scaleRatio, this.screenOffsetY * this.scaleRatio];

    this.screenContainer = g;

    this.zrenderWorkspace.add(g);
    this.zrenderWorkspace.screenContainer = g;

  }

  /** 创建删除区域 */
  createDeleteArea() {

    const g = new zrender.Group({});
    g.position = [0 * this.scaleRatio, 260 * this.scaleRatio];

    const img = new zrender.Image({
      style: {
        image: '../../assets/images/trash.png',
        x: 1 * this.scaleRatio,
        y: 60 * this.scaleRatio,
        width: 40 * this.scaleRatio,
        height: 40 * this.scaleRatio,
        opacity: 0.6
      }
    });

    const box = new zrender.Rect({
      shape: {
        x: 0,
        y: 0,
        width: 48 * this.scaleRatio,
        height: 180 * this.scaleRatio
      },
      style: {
        opacity: 0.3,
        fill: 'red'
      }
    });

    g.add(box);
    g.add(img);
    g.hide();

    this.zrenderWorkspace.add(g);
    this.zrenderWorkspace.trash = g;

  }

  /** 创建Unit区域 */
  createUnitArea() {

    const g = new zrender.Group({});
    g.position = [520 * this.scaleRatio, 180 * this.scaleRatio];

    const text = new zrender.Text({
      style: {
        text: 'Units',
        fontWeight: 'bolder',
        fontSize: 24 * this.scaleRatio,
        textFill: '#FFFFFF'
      }
    });
    text.position = [520 * this.scaleRatio, 180 * this.scaleRatio];

    this.unitContainer = g;
    this.zrenderWorkspace.add(text);
    this.zrenderWorkspace.add(g);
    this.zrenderWorkspace.unitContainer = g;

  }

  /**
   * 创建组件Svg
   * @param component 组件实例
   */
  createComponentSvg(component: BaseComponent) {
    switch (component.type) {
      case TYPE_ALIAS.SCREEN:
        return this.createScreenComponentSvg(<ScreenComponent>component);
      case TYPE_ALIAS.BUTTON:
        return this.createButtonComponentSvg(<ButtonComponent>component);
      case TYPE_ALIAS.TITLE:
        return this.createTitleComponentSvg(<TitleComponent>component);
      case TYPE_ALIAS.LABEL:
        return this.createLabelComponentSvg(<LabelComponent>component);
      case TYPE_ALIAS.RECTANGLE:
        return this.createRectangleComponentSvg(<RectangleComponent>component);
      case TYPE_ALIAS.CIRCLE:
        return this.createCircleComponentSvg(<CircleComponent>component);
      case TYPE_ALIAS.IMAGE:
        return this.createImageComponentSvg(<ImageComponent>component);
    }
  }

  /**
   * 新增屏幕Svg
   * @param component 屏幕组件实例
   */
  private createScreenComponentSvg(component: ScreenComponent) {
    const screen = new zrender.Rect({
      shape: {
        x: component.x * this.scaleRatio,
        y: component.y * this.scaleRatio,
        width: component.width * this.scaleRatio,
        height: component.height * this.scaleRatio,
      },
      style: {
        fill: component.backgroundColor
      }
    });
    screen.id = component.id;
    screen.__component = component;

    let _this = this;

    screen.on('click', function (ev) {
      _this.componentClick.apply(this, [ev, _this]);
    });

    component.componentSvg = screen;

    return screen;
  }

  /**
   * 新增按钮Svg
   * @param component 按钮组件实例
   */
  private createButtonComponentSvg(component: ButtonComponent) {
    const button = new zrender.Rect({
      shape: {
        x: component.x * this.scaleRatio,
        y: component.y * this.scaleRatio,
        width: component.width * this.scaleRatio,
        height: component.height * this.scaleRatio,
        r: [4, 4, 0, 0]
      },
      style: {
        fill: '#111111',
        stroke: '#FFFFFF',
        textRect: {
          x: component.x * this.scaleRatio,
          y: component.y * this.scaleRatio,
          width: component.width * this.scaleRatio,
          height: component.height * this.scaleRatio,
        },
        text: component.text,
        textFill: '#FFFFFF',
        fontSize: 15 * this.scaleRatio
      },
      cursor: 'default'
    });
    component.visibility ? button.show() : button.hide();

    component.componentSvg = button;

    return button;
  }

  /**
   * 创建标题组件Svg
   * @param component 标题组件实例
   */
  private createTitleComponentSvg(component: TitleComponent) {
    const title = new zrender.Rect({
      shape: {
        x: component.x * this.scaleRatio,
        y: component.y * this.scaleRatio,
        width: component.width * this.scaleRatio,
        height: component.height * this.scaleRatio
      },
      style: {
        fill: component.backgroundColor,
        textRect: {
          x: component.x * this.scaleRatio,
          y: component.y * this.scaleRatio,
          width: component.width * this.scaleRatio,
          height: component.height * this.scaleRatio
        },
        text: component.text,
        textFill: component.color,
        textPosition: [2, 4 * this.scaleRatio],
        fontSize: 15 * this.scaleRatio
      },
      draggable: true
    });
    title.id = component.id;
    title.position = [0, 0];
    title.__component = component;

    let _this = this;

    title.on('dragstart', function (ev) {
      _this.componentDragStart.apply(this, [ev, _this]);
    });
    title.on('drag', function (ev) {
      _this.componentDrag.apply(this, [ev, _this]);
    });
    title.on('dragend', function (ev) {
      _this.componentDragEnd.apply(this, [ev, _this]);
    });

    component.componentSvg = title;

    return title;
  }

  /**
   * 新增标签组件
   * @param component 标签组件实例
   */
  private createLabelComponentSvg(component: LabelComponent) {

    let font = {
      family: 'sans-serif',
      size: 16
    };
    if (this.isStick) {
      font = { family: 'sans-serif', size: 16 };
    } else {
      if (component.font === FONT_ALIAS.UBUNTU_C) font = { family: 'Ubuntu-C', size: 15 };
      else if (component.font === FONT_ALIAS.COMIC) font = { family: 'Comic', size: 25 };
      else if (component.font === FONT_ALIAS.DEJAVUSANS_18PX) font = { family: 'DejaVuSans', size: 18 };
      else if (component.font === FONT_ALIAS.DEJAVUSANS_24PX) font = { family: 'DejaVuSans', size: 24 };
      else if (component.font === FONT_ALIAS.DEJAVUSANS_40PX) font = { family: 'DejaVuSans', size: 40 };
      else if (component.font === FONT_ALIAS.DEJAVUSANS_56PX) font = { family: 'DejaVuSans', size: 56 };
      else if (component.font === FONT_ALIAS.DEJAVUSANS_72PX) font = { family: 'DejaVuSans', size: 72 };
      else font = { family: 'sans-serif', size: 16 };
    }

    const label = new zrender.Text({
      style: {
        text: component.text,
        fontSize: font.size * this.scaleRatio,
        fontFamily: font.family,
        textFill: component.color,
      },
      draggable: true
    });
    label.id = component.id;
    label.position = [component.x * this.scaleRatio, component.y * this.scaleRatio];
    label.__component = component;

    let _this = this;

    label.on('dragstart', function (ev) {
      _this.componentDragStart.apply(this, [ev, _this]);
    });
    label.on('drag', function (ev) {
      _this.componentDrag.apply(this, [ev, _this]);
    });
    label.on('dragend', function (ev) {
      _this.componentDragEnd.apply(this, [ev, _this]);
    });

    component.componentSvg = label;

    return label;
  }

  /**
   * 新增矩形组件
   * @param component 矩形组件实例
   */
  private createRectangleComponentSvg(component: RectangleComponent) {
    const rect = new zrender.Rect({
      shape: {
        width: component.width * this.scaleRatio,
        height: component.height * this.scaleRatio
      },
      style: {
        fill: component.backgroundColor,
        stroke: component.borderColor
      },
      draggable: true
    });
    rect.id = component.id;
    rect.position = [component.x * this.scaleRatio, component.y * this.scaleRatio];
    rect.__component = component;

    let _this = this;

    rect.on('dragstart', function (ev) {
      _this.componentDragStart.apply(this, [ev, _this]);
    });
    rect.on('drag', function (ev) {
      _this.componentDrag.apply(this, [ev, _this]);
    });
    rect.on('dragend', function (ev) {
      _this.componentDragEnd.apply(this, [ev, _this]);
    });

    component.componentSvg = rect;

    return rect;
  }

  /**
   * 新增圆形组件
   * @param component 圆形组件实例
   */
  private createCircleComponentSvg(component: CircleComponent) {
    const circle = new zrender.Circle({
      shape: {
        r: component.radius * this.scaleRatio
      },
      style: {
        fill: component.backgroundColor,
        stroke: component.borderColor
      },
      draggable: true
    });
    circle.id = component.id;
    circle.position = [component.x * this.scaleRatio, component.y * this.scaleRatio];
    circle.__component = component;

    let _this = this;

    circle.on('dragstart', function (ev) {
      _this.componentDragStart.apply(this, [ev, _this]);
    });
    circle.on('drag', function (ev) {
      _this.componentDrag.apply(this, [ev, _this]);
    });
    circle.on('dragend', function (ev) {
      _this.componentDragEnd.apply(this, [ev, _this]);
    });

    component.componentSvg = circle;

    return circle;
  }

  /**
   * 新增图片组件
   * @param component 图片组件实例
   */
  private createImageComponentSvg(component: ImageComponent) {
    let img = new Image();
    img.src = '../../assets/images/default.jpg';
    const image = new zrender.Image({
      style: {
        width: 100 * this.scaleRatio,
        height: 100 * this.scaleRatio,
        // image: '../../assets/images/' + component.imagePath
        image: img
      },
      draggable: true
    });
    image.id = component.id;
    image.position = [component.x * this.scaleRatio, component.y * this.scaleRatio];
    image.__component = component;

    let _this = this;

    image.on('dragstart', function (ev) {

      _this.componentDragStart.apply(this, [ev, _this]);
    });
    image.on('drag', function (ev) {
      _this.componentDrag.apply(this, [ev, _this]);
    });
    image.on('dragend', function (ev) {
      _this.componentDragEnd.apply(this, [ev, _this]);
    });
    component.componentSvg = image;

    return image;
  }
  /**
   * 创建Svg
   * @param component 新增组件实例
   */
  createSvg(component) {
    this.screenContainer.add(this.createComponentSvg(component));
  }

  /**
   * 重新渲染Svg
   */
  redrawSvg() {
    for (let i = 4; i < this.screenContainer.childCount();) {
      this.screenContainer.remove(this.screenContainer.childAt(i));
    }
    this.storeSrv.componentList.value.forEach(c => this.screenContainer.add(this.createComponentSvg(c)));
    // this.storeSrv.unitList.value.forEach(u => this.unitContainer.add(this.updateUnitSvg()));
    this.updateUnitSvg();
  }

  /**
   * 更新Svg
   */
  updateSvg(component, key, value) {
    switch (key) {
      case COMPONENT_ALIAS.X:
      case COMPONENT_ALIAS.Y:
        if (this.isStick) {
          component['componentSvg'].attr('position', [component.x * this.scaleRatio * 2, component.y * this.scaleRatio * 2]);
          console.log(component);
          
        } else {
          component['componentSvg'].attr('position', [component.x * this.scaleRatio, component.y * this.scaleRatio]);
        }
        break;
      case COMPONENT_ALIAS.WIDTH:
      case COMPONENT_ALIAS.HEIGHT:
        if (this.isStick) {
          component['componentSvg'].attr({ shape: { [key]: value * this.scaleRatio * 2 } });
        } else {
          component['componentSvg'].attr({ shape: { [key]: value * this.scaleRatio } });
        }
        break;
      case COMPONENT_ALIAS.RADIUS:
        component['componentSvg'].attr({ shape: { r: value * this.scaleRatio } });
        break;
      case COMPONENT_ALIAS.TEXT:
        component['componentSvg'].attr({ style: { text: value } });
        break;
      case COMPONENT_ALIAS.COLOR:
        component['componentSvg'].attr({ style: { textFill: value } });
        break;
      case COMPONENT_ALIAS.BORDER_COLOR:
        component['componentSvg'].attr({ style: { stroke: value } });
        break;
      case COMPONENT_ALIAS.BACKGROUND_COLOR:
        component['componentSvg'].attr({ style: { fill: value } });
        break;
      case COMPONENT_ALIAS.FONT:
        if (value === FONT_ALIAS.UBUNTU_C) component['componentSvg'].attr({ style: { fontFamily: 'Ubuntu-C', fontSize: 15 } });
        else if (value === FONT_ALIAS.COMIC) component['componentSvg'].attr({ style: { fontFamily: 'Comic', fontSize: 25 } });
        else if (value === FONT_ALIAS.DEJAVUSANS_18PX) component['componentSvg'].attr({ style: { fontFamily: 'DejaVuSans', fontSize: 18 } });
        else if (value === FONT_ALIAS.DEJAVUSANS_24PX) component['componentSvg'].attr({ style: { fontFamily: 'DejaVuSans', fontSize: 24 } });
        else if (value === FONT_ALIAS.DEJAVUSANS_40PX) component['componentSvg'].attr({ style: { fontFamily: 'DejaVuSans', fontSize: 40 } });
        else if (value === FONT_ALIAS.DEJAVUSANS_56PX) component['componentSvg'].attr({ style: { fontFamily: 'DejaVuSans', fontSize: 56 } });
        else if (value === FONT_ALIAS.DEJAVUSANS_72PX) component['componentSvg'].attr({ style: { fontFamily: 'DejaVuSans', fontSize: 72 } });
        else if (value === FONT_ALIAS.DEFAULT_SMALL) component['componentSvg'].attr({ style: { fontFamily: 'sans-serif', fontSize: 10 } });
        else component['componentSvg'].attr({ style: { fontFamily: 'sans-serif', fontSize: 13 } });
      case COMPONENT_ALIAS.VISIBILITY:
        if (component.type === TYPE_ALIAS.BUTTON) {
          value === 'true' ? component['componentSvg'].show() : component['componentSvg'].hide();
        }
        break;
      case COMPONENT_ALIAS.LAYER:
        component['componentSvg'].attr({ zlevel: value });
        break;
      case COMPONENT_ALIAS.IMAGE_PATH:
        component['componentSvg'].attr({ style: { image: value } });
        break;
      case COMPONENT_ALIAS.IMAGE_WIDTH:
        component['componentSvg'].attr({ style: { width: value * this.scaleRatio } });
        break;
      case COMPONENT_ALIAS.IMAGE_HEIGHT:
        component['componentSvg'].attr({ style: { height: value * this.scaleRatio } });
        break;
      default:
        break;
    }
    if (!this.globalOperatorSrv.codeLock.value) {
      this.codeEditorSrv.updateWorkspaceValue();
    }
  }

  /**
   * 组件拖拽开始事件
   * @param ev 鼠标事件
   * @param _this 服务作用域
   */
  private componentDragStart(ev, _this) {
    ev.event.preventDefault();
    ev.event.stopPropagation();
    this['__zr'].trash.show();
    this['__startX'] = this['__component'].getProp('x');
    this['__startY'] = this['__component'].getProp('y');
    _this.globalOperatorSrv.setSelectedComponent(null);
  }

  /**
   * 组件拖拽事件
   * @param ev 鼠标事件
   * @param _this 服务作用域
   */
  private componentDrag(ev, _this) {


    this['__component'].setProp('x', Math.floor(this['position'][0] / _this.scaleRatio));
    this['__component'].setProp('y', Math.floor(this['position'][1] / _this.scaleRatio));
  }

  /**
   * 组件拖拽结束事件
   * @param ev 鼠标事件
   * @param _this 服务作用域
   */
  private componentDragEnd(ev, _this) {
    this['__zr'].trash.hide();
    // 判断是否在移除区域
    if (this['__zr'].trash.children()[0].contain(ev.event.layerX ? ev.event.layerX : ev.event.zrX , ev.event.layerY ? ev.event.layerY : ev.event.zrY)) {
      _this.storeSrv.removeComponentById(this['id']);
      _this.globalOperatorSrv.setSelectedComponent(null);
      if (!_this.globalOperatorSrv.codeLock.value) {
        _this.codeEditorSrv.updateWorkspaceValue();
      }
      return this['__zr'].screenContainer.remove(this);
    }
    // 判断是否在可放置区域
    if (!this['__zr'].screenContainer.children()[0].contain(ev.event.layerX ? ev.event.layerX : ev.event.zrX , ev.event.layerY ? ev.event.layerY : ev.event.zrY)) {
      this['attr']('position', [Math.floor(this['__startX'] * _this.scaleRatio), Math.floor(this['__startY'] * _this.scaleRatio)]);
      this['__component'].setProp('x', Math.floor(this['__startX']));
      this['__component'].setProp('y', Math.floor(this['__startY']));
      _this.globalOperatorSrv.setSelectedComponent(this['__component']);
      return;
    }
    // 判断是否为Title组件
    if (this['__component'].type === TYPE_ALIAS.TITLE) {
      this['attr']('position', [0, 0]);
      _this.globalOperatorSrv.setSelectedComponent(this['__component']);
      return;
    }
    if (_this.isStick) {

      this['__component'].setProp('x', Math.floor(this['position'][0] / _this.scaleRatio / 2));
      this['__component'].setProp('y', Math.floor(this['position'][1] / _this.scaleRatio / 2));
    } else {
      this['__component'].setProp('x', Math.floor(this['position'][0] / _this.scaleRatio));
      this['__component'].setProp('y', Math.floor(this['position'][1] / _this.scaleRatio));
    }

    _this.globalOperatorSrv.setSelectedComponent(this['__component']);
    if (!_this.globalOperatorSrv.codeLock.value) {
      _this.codeEditorSrv.updateWorkspaceValue();
    }
  }

  private componentClick(ev, _this) {
    _this.globalOperatorSrv.setSelectedComponent(this['__component']);
  }

  /** 更新Unit列表 */
  updateUnitSvg() {
    // 清空原内容
    this.zrenderWorkspace.unitContainer.removeAll();
    this.zrenderWorkspace._needsRefresh = true;

    let len = this.storeSrv.unitList.value.length;
    this.storeSrv.unitList.value.forEach((u, index) => {
        console.log(index);
        
      let g = new zrender.Group({});
      g.id = u.id;
      g.create_time = u.createTime;
      g.type = u.type;
      let x = index % 5 * 70;
      let y = Math.floor(index / 5) * 70 + 40;

      g.position = [x * this.scaleRatio, y * this.scaleRatio];
      let box = new zrender.Rect({
        shape: {
          x: 0,
          y: 0,
          width: 48 * this.scaleRatio,
          height: 48 * this.scaleRatio,
          r: [4]
        },
        style: {
          lineWidth: 2,
          stroke: '#FFFFFF',
          fill: '#303131'
        }
      });

      let img = new zrender.Image({
        style: {
          image: '../../assets/images/units/' + u.icon,
          width: 48 * this.scaleRatio,
          height: 48 * this.scaleRatio,
          x: 0,
          y: 0
        },
        draggable: true
      });

      let _this = this;

      img.on('click', function (ev: MouseEvent) {
        _this.globalOperatorSrv.setSelectedUnit(u);
      });

      img.on('dragstart', function (ev) {
        _this.zrenderWorkspace.trash.show();
        this.__originalPosition = {
          x: this.position[0] * _this.scaleRatio,
          y: this.position[1] * _this.scaleRatio
        };
      });

      img.on('dragend', function (ev) {
        _this.zrenderWorkspace.trash.hide();
        // 判断是否在移除区域内
        if (this['__zr'].trash.children()[0].contain(ev.event.layerX ? ev.event.layerX : ev.event.zrX , ev.event.layerY ? ev.event.layerY : ev.event.zrY)) {
          _this.storeSrv.removeUnitById(this.parent.id);
          _this.updateUnitSvg();
          if (!_this.globalOperatorSrv.codeLock.value) {
            _this.codeEditorSrv.updateWorkspaceValue();
          }
          return;
        }
        this.attr('position', [this.__originalPosition.x, this.__originalPosition.y]);
      });

      g.add(box);
      g.add(img);

      u.unitSvg = g;

      this.zrenderWorkspace.unitContainer.add(g);
    });

    const g = new zrender.Group({});
    let x = len % 5 * 70;
    let y = Math.floor(len / 5) * 70 + 40
    g.position = [x * this.scaleRatio, y * this.scaleRatio];

    const box = new zrender.Rect({
      shape: {
        x: 0,
        y: 0,
        width: 48 * this.scaleRatio,
        height: 48 * this.scaleRatio,
        r: [4]
      },
      style: {
        lineWidth: 2,
        stroke: '#FFFFFF',
        fill: '#303131'
      }
    });

    const img = new zrender.Image({
      style: {
        image: '../../assets/images/add.png',
        width: 48 * this.scaleRatio,
        height: 48 * this.scaleRatio,
        x: 0,
        y: 0
      }
    });

    img.on('mouseover', function (ev) {
      box.animate('style', false)
        .when(200, {
          fill: 'rgb(0, 100, 160)'
        })
        .start();
    });

    img.on('mouseout', function (ev) {
      box.animate('style', false)
        .when(300, {
          fill: '#303131'
        })
        .start();
    });

    img.on('click', (ev) => {
      let maskModal = this.globalOperatorSrv.createMaskModal(MaskComponent);
      (<MaskComponent>maskModal.instance).createDynamicComponent(DYNAMIC_COMPONENT_TYPE.UNIT_MODAL);
    });

    g.add(box);
    g.add(img);

    this.zrenderWorkspace.unitContainer.add(g);
  }
}
