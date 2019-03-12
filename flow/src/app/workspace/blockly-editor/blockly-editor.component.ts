import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { BlocklyEditorService, GlobalOperatorService, StoreService } from 'src/app/services/services.module';
import { LOCALSTORAGE_KEY } from 'src/app/utils/common-data';
import { style } from '@angular/animations';
import { element } from 'protractor';
import { Observable } from 'rxjs';
import { Logs } from 'selenium-webdriver';

@Component({
  selector: 'app-blockly-editor',
  templateUrl: './blockly-editor.component.html',
  styleUrls: ['./blockly-editor.component.scss']
})
export class BlocklyEditorComponent implements OnInit, AfterViewInit {


  @ViewChild('wrapperBlocklyEditor') wrapperBlocklyEditor: ElementRef;

  @ViewChild('wrapperBlocklyToolbox') wrapperBlocklyToolbox: ElementRef;

  public _type;
  constructor(private blocklyEditorSrv: BlocklyEditorService, private globalOperator: GlobalOperatorService, private storeSrv: StoreService) { }

  ngOnInit() {
    this.blocklyEditorSrv.init({
      wrapperId: this.wrapperBlocklyEditor.nativeElement.id,
      toolboxId: this.wrapperBlocklyToolbox.nativeElement.id,
      language: localStorage.getItem(LOCALSTORAGE_KEY.LANGUAGE) || 'en'
    });

    this.storeSrv.getType().subscribe(data => {
      this._type = data;
      try {
        window['BlocklyEditor'].toolbox_.tree_.children_[4].element_.setAttribute('style', 'display:block');
        window['BlocklyEditor'].toolbox_.tree_.children_[10].element_.setAttribute('style', 'display:block');
        window['BlocklyEditor'].toolbox_.tree_.children_[11].element_.setAttribute('style', 'display:block');
        window['Blockly'].mainWorkspace.toolbox_.tree_.children_[2].children_[1].element_.setAttribute('style', 'display:block');
        window['Blockly'].mainWorkspace.toolbox_.tree_.children_[2].children_[2].element_.setAttribute('style', 'display:block');
      } catch (error) {

      }
      if (data === 'stick') {
        try {
          window['BlocklyEditor'].toolbox_.tree_.children_[4].element_.setAttribute('style', 'display:none');
          window['BlocklyEditor'].toolbox_.tree_.children_[10].element_.setAttribute('style', 'display:none');
          window['BlocklyEditor'].toolbox_.tree_.children_[11].element_.setAttribute('style', 'display:none');
          window['Blockly'].mainWorkspace.toolbox_.tree_.children_[2].children_[1].element_.setAttribute('style', 'display:none');
          window['Blockly'].mainWorkspace.toolbox_.tree_.children_[2].children_[2].element_.setAttribute('style', 'display:none');
        } catch (error) {
        }
      }
    });
    // this.hiddenAllblock();
    this.storeSrv.getComponentList().subscribe(data => {
      if (data.length === 0) {
        return;
      }
      try {
        window['Blockly'].mainWorkspace.toolbox_.tree_.children_[1].children_[0].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[1].children_[1].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[1].children_[2].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[1].children_[3].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[1].children_[4].element_.setAttribute('style', 'display:none');
      } catch (error) {
        return;
      }
      data.forEach((d) => {
          try {
          if (d.type === 'title') {
            window['BlocklyEditor'].toolbox_.tree_.children_[1].children_[0].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'label') {
            window['BlocklyEditor'].toolbox_.tree_.children_[1].children_[1].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'rectangle') {
            window['BlocklyEditor'].toolbox_.tree_.children_[1].children_[2].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'circle') {
            window['BlocklyEditor'].toolbox_.tree_.children_[1].children_[3].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'image') {
            window['BlocklyEditor'].toolbox_.tree_.children_[1].children_[4].element_.setAttribute('style', 'display:block');
          }
        } catch (err) { }
      });
    });
    this.storeSrv.getUnitList().subscribe(data => {
      try {
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[0].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[1].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[2].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[3].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[4].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[5].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[6].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[7].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[8].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[9].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[10].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[11].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[12].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[13].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[14].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[15].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[16].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[17].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[18].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[19].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[20].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[21].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[22].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[23].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[24].element_.setAttribute('style', 'display:none');
        window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[25].element_.setAttribute('style', 'display:none');
      } catch (error) {
        return;
      }
      data.forEach((d) => {
        try {
          if (d.type === 'env') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[0].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'angle') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[1].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'pir') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[2].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'neopixel') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[3].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'joystick') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[4].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'light') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[5].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'earth') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[6].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'makey') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[7].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'servo') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[8].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'weigh') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[9].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'pulse') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[10].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'track') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[11].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'button') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[12].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'dual_button') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[13].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'rgb') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[14].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'relay') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[15].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'adc') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[16].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'dac') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[17].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'tof') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[18].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'ncir') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[19].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'ir') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[20].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'ext_io') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[21].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'color') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[22].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'finger') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[23].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'rfid') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[24].element_.setAttribute('style', 'display:block');
          } else if (d.type === 'cardkb') {
            window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[25].element_.setAttribute('style', 'display:block');
          }
        } catch (err) { }
      });
    });
  }

  ngAfterViewInit() {
    this.storeSrv.setHiddenBlockly().subscribe(() => {
      setTimeout(() => {
        this.hiddenAllblock();
        this.setBlockIcon();
        this.storeSrv.loddingMODE.next(false);
      }, 500);
    }
    );
  }

  hiddenAllblock() {
    window['Blockly'].svgResize(this.blocklyEditorSrv.workspace);
    this.blocklyEditorSrv.workspace.toolbox_.tree_.expandAll();
    this.blocklyEditorSrv.workspace.toolbox_.tree_.collapseAll();

    // 临时隐藏
    window['BlocklyEditor'].toolbox_.tree_.children_[17].children_[1].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[17].children_[2].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[17].children_[3].element_.setAttribute('style', 'display:none');

   if (this._type === 'stick') {
    window['BlocklyEditor'].toolbox_.tree_.children_[4].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[10].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[11].element_.setAttribute('style', 'display:none');
    window['Blockly'].mainWorkspace.toolbox_.tree_.children_[2].children_[1].element_.setAttribute('style', 'display:none');
    window['Blockly'].mainWorkspace.toolbox_.tree_.children_[2].children_[2].element_.setAttribute('style', 'display:none');
   }
    
    //  UI 
    window['Blockly'].mainWorkspace.toolbox_.tree_.children_[1].children_[0].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[1].children_[1].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[1].children_[2].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[1].children_[3].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[1].children_[4].element_.setAttribute('style', 'display:none');

    // units
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[0].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[1].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[2].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[3].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[4].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[5].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[6].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[7].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[8].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[9].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[10].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[11].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[12].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[13].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[14].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[15].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[16].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[17].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[18].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[19].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[20].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[21].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[22].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[23].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[24].element_.setAttribute('style', 'display:none');
    window['BlocklyEditor'].toolbox_.tree_.children_[3].children_[25].element_.setAttribute('style', 'display:none');
  }
  setBlockIcon() {
    window['BlocklyEditor'].toolbox_.tree_.children_[6].element_.firstElementChild.children[1].classList.add('blocklyTreeIconVar');
    window['BlocklyEditor'].toolbox_.tree_.children_[7].element_.firstElementChild.children[1].classList.add('blocklyTreeIconMath');
    window['BlocklyEditor'].toolbox_.tree_.children_[8].element_.firstElementChild.children[1].classList.add('blocklyTreeIconLoop');
    window['BlocklyEditor'].toolbox_.tree_.children_[9].element_.firstElementChild.children[1].classList.add('blocklyTreeIconLogic');
    window['BlocklyEditor'].toolbox_.tree_.children_[10].element_.firstElementChild.children[1].classList.add('blocklyTreeIconGraphic');
    window['BlocklyEditor'].toolbox_.tree_.children_[11].element_.firstElementChild.children[1].classList.add('blocklyTreeIconEmoji');
    window['BlocklyEditor'].toolbox_.tree_.children_[12].element_.firstElementChild.children[1].classList.add('blocklyTreeIconTimer');
    window['BlocklyEditor'].toolbox_.tree_.children_[13].element_.firstElementChild.children[1].classList.add('blocklyTreeIconFunction');
    window['BlocklyEditor'].toolbox_.tree_.children_[14].element_.firstElementChild.children[1].classList.add('blocklyTreeIconText');
    window['BlocklyEditor'].toolbox_.tree_.children_[15].element_.firstElementChild.children[1].classList.add('blocklyTreeIconLists');
  }

  stopPropagation() {
    this.globalOperator.setSelectedComponent(null);
    this.globalOperator.setSelectedUnit(null);
  }

  padMethod() {

  }
}
