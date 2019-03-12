import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, ElementRef } from '@angular/core';
import { GlobalOperatorService } from 'src/app/services/global-operator.service';
import { DYNAMIC_COMPONENT_TYPE } from 'src/app/utils/common-data';
import { UnitModalComponent } from 'src/app/workspace/unit-modal/unit-modal.component';
import { SettingPanelComponent } from 'src/app/core/setting-panel/setting-panel.component';
import { ResourceManagerComponent } from 'src/app/core/resource-manager/resource-manager.component';

@Component({
  selector: 'app-mask',
  templateUrl: './mask.component.html',
  styleUrls: ['./mask.component.scss']
})
export class MaskComponent implements OnInit {

  @ViewChild('wrapperFullMask') wrapperFullMask: ElementRef;

  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

  dynamicComponent: any = null;

  constructor(private resolver: ComponentFactoryResolver, private globalOperatorSrv: GlobalOperatorService) { }

  ngOnInit() {
  }

  createDynamicComponent(dynamicComponentType) {
    let contentClass = null;

    switch(dynamicComponentType) {
      case DYNAMIC_COMPONENT_TYPE.UNIT_MODAL:
        contentClass = UnitModalComponent;
        break;
      case DYNAMIC_COMPONENT_TYPE.SETTING_PANEL:
        contentClass = SettingPanelComponent;
        break;
      case DYNAMIC_COMPONENT_TYPE.RESOURCE_MANAGER:
        contentClass = ResourceManagerComponent;
        break;
      default:
        break;
    }

    if(contentClass === null) return;

    let factory = this.resolver.resolveComponentFactory(contentClass);
    this.dynamicComponent = this.container.createComponent(factory);

    document.getElementsByClassName('app')[0].classList.add('blur');
  }

  removeMask() {
    document.getElementsByClassName('app')[0].classList.remove('blur');
    this.wrapperFullMask.nativeElement.classList.add('hide');

    let timer = setTimeout(() => {
      this.globalOperatorSrv.maskModal.destroy();
      clearTimeout(timer);
    }, 100);
  }

  destroy() {
    
  }

}
