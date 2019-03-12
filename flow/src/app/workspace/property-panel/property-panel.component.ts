import { Component, OnInit, ViewChild, ElementRef,Renderer2 } from '@angular/core';
import { GlobalOperatorService, ZrenderHelperMbService } from 'src/app/services/services.module';
import { Observable } from 'rxjs';
import { BaseComponent } from 'src/app/domain/component';
import { TYPE_ALIAS, COMPONENT_ALIAS } from 'src/app/utils/common-data';
import { ZrenderHelperService } from 'src/app/services/zrender-helper.service';

@Component({
  selector: 'app-property-panel',
  templateUrl: './property-panel.component.html',
  styleUrls: ['./property-panel.component.scss']
})
export class PropertyPanelComponent implements OnInit {
s
  private offsetX = 20;

  private headerHeight = 48;

  @ViewChild('wrapperPropertyPanel') wrapperPropertyPanel: ElementRef;

  selectedComponent$: Observable<BaseComponent>;

  selectedComponent = null;

  selectedComponentProperty = [];

  /**  */
  UIHELP;
  constructor(
    private globalOperatorSrv: GlobalOperatorService,
    private zrenderHelpsrv: ZrenderHelperService,
    private zrenderHelperSrvmb: ZrenderHelperMbService,
    private rd2: Renderer2
  ) {
    this.selectedComponent$ = this.globalOperatorSrv.getSelectedComponent();
      if (this.globalOperatorSrv.ismb) {
        this.UIHELP = this.zrenderHelperSrvmb;
      } else {
        this.UIHELP = this.zrenderHelpsrv;
      }
  }

  ngOnInit() {
    this.globalOperatorSrv.getSelectedComponent().subscribe(component => {
      if(component === null) return;
      
      this.selectedComponent = component;
      if(this.selectedComponent.type === TYPE_ALIAS.SCREEN || this.selectedComponent.type === TYPE_ALIAS.BUTTON) {
        this.selectedComponentProperty = component.getAllProps();
      } else {
        let _type = localStorage.getItem('_type');
        //  if( _type === 'stick') {
        //     component.width = 15;
        //     component.height = 15;
        //  }
        this.selectedComponentProperty = component.getAllProps().slice(3);
      }
      let screenOffsetX = this.UIHELP.screenOffsetX;
      let screenOffsetY = this.UIHELP.screenOffsetY;

      if (this.globalOperatorSrv.ismb) {
        this.wrapperPropertyPanel.nativeElement.style.left = 'calc(50% - 30px)';
        this.wrapperPropertyPanel.nativeElement.style.top = '90px';
      } else {
        switch(component.type) {
          case TYPE_ALIAS.TITLE:
            this.wrapperPropertyPanel.nativeElement.style.left = (component.x + component['width'] + this.offsetX + screenOffsetX) * this.UIHELP.scaleRatio + 'px';
            this.wrapperPropertyPanel.nativeElement.style.top = (component.y + screenOffsetY + this.headerHeight) * this.UIHELP.scaleRatio + 'px';
            break;
          case TYPE_ALIAS.LABEL:
            this.wrapperPropertyPanel.nativeElement.style.left = (component.x + this.offsetX + screenOffsetX + component['componentSvg'].getBoundingRect().width) * this.UIHELP.scaleRatio + 'px';
            this.wrapperPropertyPanel.nativeElement.style.top = (component.y + screenOffsetY + this.headerHeight) * this.UIHELP.scaleRatio + 'px';
            break;
          case TYPE_ALIAS.RECTANGLE:
            this.wrapperPropertyPanel.nativeElement.style.left = (component.x + component['width'] + this.offsetX + screenOffsetX) * this.UIHELP.scaleRatio + 'px';
            this.wrapperPropertyPanel.nativeElement.style.top = (component.y + screenOffsetY + this.headerHeight) * this.UIHELP.scaleRatio + 'px';
            break;
          case TYPE_ALIAS.CIRCLE:
            this.wrapperPropertyPanel.nativeElement.style.left = (component.x + component['radius'] + this.offsetX + screenOffsetX) * this.UIHELP.scaleRatio + 'px';
            this.wrapperPropertyPanel.nativeElement.style.top = (component.y - component['radius'] + screenOffsetY + this.headerHeight) * this.UIHELP.scaleRatio + 'px';
            break;
          case TYPE_ALIAS.IMAGE:
            this.wrapperPropertyPanel.nativeElement.style.left = (this.offsetX + screenOffsetX + 320) * this.UIHELP.scaleRatio + 'px';
            this.wrapperPropertyPanel.nativeElement.style.top = (component.y + screenOffsetY + this.headerHeight) * this.UIHELP.scaleRatio + 'px';
            break;
          case TYPE_ALIAS.BUTTON:
            this.wrapperPropertyPanel.nativeElement.style.left = (component.x + screenOffsetX) * this.UIHELP.scaleRatio + 'px';
            this.wrapperPropertyPanel.nativeElement.style.top = (component.y + screenOffsetY + this.headerHeight + 90) * this.UIHELP.scaleRatio + 'px';
            break;
          case TYPE_ALIAS.SCREEN:
            this.wrapperPropertyPanel.nativeElement.style.left = (component.x + this.offsetX + screenOffsetX + 320) * this.UIHELP.scaleRatio + 'px';
            this.wrapperPropertyPanel.nativeElement.style.top = (component.y + screenOffsetY + this.headerHeight) * this.UIHELP.scaleRatio + 'px';
            break;
          default:
            this.wrapperPropertyPanel.nativeElement.style.display = 'none';
            break;
        }
      }
    });
  }

  stopPropagation(ev: MouseEvent) {
    ev.stopPropagation();
  }

  changePropertyHandler(data) {
    if(this.selectedComponent === null) return;
    if (data.key === 'x' || data.key === 'y' || data.key == 'width' || data.key === 'height') {
      this.selectedComponent.setProp(data.key, data.value);
    } else {
      this.selectedComponent.setProp(data.key, data.value);
    }
    if(data.key === COMPONENT_ALIAS.IMAGE_PATH) return;
    this.UIHELP.updateSvg(this.selectedComponent, data.key, data.value);
  }

  updateImgHandler(base64) {
    // let img = new Image();
    let img = document.createElement('img');
    img.onload = () => {
      document.body.appendChild(img);
      let width = img.width - 0;
      let height = img.height - 0;
      img.style.display = 'none';
      this.UIHELP.updateSvg(this.selectedComponent, COMPONENT_ALIAS.IMAGE_PATH, `${base64}`);
      this.UIHELP.updateSvg(this.selectedComponent, COMPONENT_ALIAS.IMAGE_WIDTH, width);
      this.UIHELP.updateSvg(this.selectedComponent, COMPONENT_ALIAS.IMAGE_HEIGHT, height);
      this.selectedComponent.componentSvg.dirty();
      this.selectedComponent.componentSvg._image.onload = () => {
        this.selectedComponent.componentSvg.dirty();
      }

      // let img1 = new Image();
      // img1.src = this.selectedComponent.componentSvg.style.image;
      this.selectedComponent.componentSvg._image.src = this.selectedComponent.componentSvg.style.image;
      document.body.removeChild(img);
    }
    img.src = `${base64}`;
  }

  changeToDefaultImgHandler() {
    this.selectedComponent.setProp(COMPONENT_ALIAS.IMAGE_PATH, 'default.jpg');
    this.UIHELP.updateSvg(this.selectedComponent, COMPONENT_ALIAS.IMAGE_PATH, `../../../assets/images/default.jpg`);
    this.UIHELP.updateSvg(this.selectedComponent, COMPONENT_ALIAS.IMAGE_WIDTH, 100);
    this.UIHELP.updateSvg(this.selectedComponent, COMPONENT_ALIAS.IMAGE_HEIGHT, 100);
    this.selectedComponent.componentSvg.dirty();
    this.selectedComponent.componentSvg._image.onload = () => {
      this.selectedComponent.componentSvg.dirty();
    }
    this.selectedComponent.componentSvg._image.src = this.selectedComponent.componentSvg.style.image;
  }

  close() {
    this.rd2.removeClass(this.wrapperPropertyPanel.nativeElement, 'show')
  }

}

