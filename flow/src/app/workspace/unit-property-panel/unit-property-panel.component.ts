import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { GlobalOperatorService, CodeEditorService } from 'src/app/services/services.module';
import { BaseUnit, UnitNeopixel } from 'src/app/domain/unit';
import { Observable } from 'rxjs';
import { ZrenderHelperService } from 'src/app/services/zrender-helper.service';

@Component({
  selector: 'app-unit-property-panel',
  templateUrl: './unit-property-panel.component.html',
  styleUrls: ['./unit-property-panel.component.scss']
})
export class UnitPropertyPanelComponent implements OnInit {

  @ViewChild('wrapperPropertyPanel') wrapperPropertyPanel: ElementRef;

  selectedUnit$: Observable<BaseUnit>;

  offsetX: number = 40;

  offsetY: number = 520;

  constructor(
    private globalOperatorSrv: GlobalOperatorService,
    private zrenderHelperSrv: ZrenderHelperService,
    private codeEditorSrv: CodeEditorService
  ) { 
    this.selectedUnit$ = this.globalOperatorSrv.getSelectedUnit();
  }

  ngOnInit() {
    this.globalOperatorSrv.getSelectedUnit().subscribe(unit => {
      if(unit === null) return;
      let fixY = this.zrenderHelperSrv.scaleRatio === 1 ? 10 : 20;
      this.wrapperPropertyPanel.nativeElement.style.left = (unit.unitSvg.position[0] + this.offsetX + 10 - 0) * this.zrenderHelperSrv.scaleRatio + 'px';
      this.wrapperPropertyPanel.nativeElement.style.top = (unit.unitSvg.position[1] + this.offsetY + 128 - 30) * this.zrenderHelperSrv.scaleRatio + fixY + 'px';
    });
  }

  stopPropagation(ev: MouseEvent) {
    ev.stopPropagation();
  }

  setUnitPort(ev) {
    this.globalOperatorSrv.selectedUnit.value.port = ev.target.value;
    if(!this.globalOperatorSrv.codeLock.value) {
      this.codeEditorSrv.updateWorkspaceValue();
    }
  }

  setUnitCount(ev) {
    let count = ev.target.value;
    if(count !== '') {
      (<UnitNeopixel>this.globalOperatorSrv.selectedUnit.value).count = +count;
    }
    if(!this.globalOperatorSrv.codeLock.value) {
      this.codeEditorSrv.updateWorkspaceValue();
    }
  }

}
