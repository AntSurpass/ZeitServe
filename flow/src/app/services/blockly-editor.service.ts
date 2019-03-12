import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CodeEditorService } from './code-editor.service';
import { StoreService } from 'src/app/services/store.service';
import { GlobalOperatorService } from './global-operator.service';
import { TouchSequence } from 'selenium-webdriver';
interface BlocklyOpt {
  wrapperId: string;
  toolboxId: string;
  language: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlocklyEditorService {

  Blockly = window['Blockly'];

  /** 工作区 */
  public workspace = null;

  constructor(private http: Http, private codeEditorSrv: CodeEditorService, private globalOperatorSrv: GlobalOperatorService, private storeSrv: StoreService) { 
    this.init = this.init.bind(this);
    this.extEvent = this.extEvent.bind(this);
  }

  /**
   * 初始化Blockly编辑器
   */
  public init(opts: BlocklyOpt, cb = null) {
    
    this.http.get(`../../assets/blockly/language/${opts.language || 'en'}.json`).subscribe(res => {
      if(this.workspace !== null)  {
        this.workspace.dispose();
        
        if(cb == null) {
          setTimeout(() => {
            window['BlocklyEditor'].clear();
            const toxml_text = window.sessionStorage.getItem('xml');
            const xml2 = window['Blockly'].Xml.textToDom(toxml_text);
            window['Blockly'].Xml.domToWorkspace(xml2, window['BlocklyEditor']);
          }, 0);
        }
      };
      this.Blockly.Msg = Object.assign(this.Blockly.Msg, res.json());
      this.workspace = this.Blockly.inject(opts.wrapperId, {
        toolbox: document.getElementById(opts.toolboxId),
        trashcan: true,
        sounds: false,
        comments: false,
        zoom: {
          controls: true,
          wheel: false,
          startScale: 1,
          maxScale: 3,
          minScale:0.2,
          scaleSpeed: 1.2
        },
        grid: {
          spacing: 20,
          length: 0,
          colour: '#666',
          snap: true
        }
      });

      let setupBlock = this.workspace.newBlock('basic_on_setup', 'setup_block');
      setupBlock.moveBy(50, 50);
      setupBlock.initSvg();
      setupBlock.render();

      this.workspace.addChangeListener(this.extEvent);
      this.bindButtonCallback(opts);
      window['BlocklyEditor'] = this.workspace;

      this.storeSrv.hiddenBlockly.next('');

      if(cb) {
        cb();
      }
    });
  }

  /**
   * Blockly自定义事件
   * @param event 事件对象
   */
  private extEvent(event) {
    this.globalOperatorSrv.setSelectedComponent(null);
    this.globalOperatorSrv.setSelectedUnit(null);
    switch(event.type) {
      case 'create':
        if(event.blockId === 'setup_block') return;
        let block = this.workspace.getBlockById(event.blockId);
       if ( block.type === 'remote_add_label' ||
        block.type === 'remote_add_slider' ||
        block.type === 'remote_add_button' ||
        block.type === 'remote_add_switch') {
         this.storeSrv.erweima.next(true);
       }
        
        block.setDisabled(true);
        break;
      case 'move':
      
        let blocks = this.workspace.getAllBlocks();
        blocks.forEach(block => {
          block.setDisabled(this.checkDisabled(block));
        });
        if(!this.globalOperatorSrv.codeLock.value) {
          this.codeEditorSrv.updateWorkspaceValue();
        }
        break;
      case 'delete':
        for(let i = 0; i < window['Blockly']['ButtonEvents'].length; i++) {
          if(window['Blockly']['ButtonEvents'][i].id == event.blockId) {
            window['Blockly']['ButtonEvents'].splice(i, 1);
            break;
          }
        }
        window['Blockly']['Remotes'].splice(window['Blockly']['Remotes'].findIndex(r => r.id === event.blockId), 1);
        if(window['Blockly']['Remotes'].length === 0) {
          this.storeSrv.erweima.next(false);
        }
        break;
      case 'ui':
        if(!event.blockId || event.blockId === 'setup_block') return;
        let _block = this.workspace.getBlockById(event.blockId);
        if(_block.isShadow_) return;
        if(window['dblclickObj'] == undefined) {
          window['dblclickObj'] = {
            block: _block,
            timestamp: Date.now()
          }
          return;
        }
        else if(window['dblclickObj'].block === _block) {
          if(Date.now() - window['dblclickObj'].timestamp <= 300) {
            window['Blockly'].duplicate_(_block);
            return;
          }
          window['dblclickObj'] = {
            block: _block,
            timestamp: Date.now()
          }
        }
        else {
          window['dblclickObj'] = {
            block: _block,
            timestamp: Date.now()
          }
        }
        break;
      default:
        return;
    }
  }

  /**
   * 检查块是否可用
   * @param block 块
   */
  private checkDisabled(block) {
    if(block.id === 'setup_block' || block.type === 'unit_button_callback'|| block.type === 'unit_dual_button_callback'|| block.type === 'mqtt_sub'|| block.type === 'finger_read'|| block.type === 'lorawan_initrx'|| block.type === 'procedures_defnoreturn' ||
        block.type === 'procedures_defreturn' ||
        block.type === 'button_callback' || 
        block.type === 'remote_add_switch' ||
        block.type === 'remote_add_button' ||
        block.type === 'remote_add_slider' ||
        block.type === 'remote_add_label' ) return false;
    return this.workspace.getBlockById(block.id).getRootBlock().id !== 'setup_block' && 
    this.workspace.getBlockById(block.id).getRootBlock().type !== 'unit_dual_button_callback' &&
    this.workspace.getBlockById(block.id).getRootBlock().type !== 'unit_button_callback' && this.workspace.getBlockById(block.id).getRootBlock().type !== 'mqtt_sub' && this.workspace.getBlockById(block.id).getRootBlock().type !== 'finger_read' &&
    this.workspace.getBlockById(block.id).getRootBlock().type !== 'lorawan_initrx'&&
            this.workspace.getBlockById(block.id).getRootBlock().type !== 'procedures_defnoreturn' &&
            this.workspace.getBlockById(block.id).getRootBlock().type !== 'procedures_defreturn' &&
            this.workspace.getBlockById(block.id).getRootBlock().type !== 'button_callback' &&
            this.workspace.getBlockById(block.id).getRootBlock().type !== 'remote_add_switch' &&
            this.workspace.getBlockById(block.id).getRootBlock().type !== 'remote_add_button' &&
            this.workspace.getBlockById(block.id).getRootBlock().type !== 'remote_add_slider'&&
            this.workspace.getBlockById(block.id).getRootBlock().type !== 'remote_add_label';
  }

  private bindButtonCallback(opts: BlocklyOpt) {
    let _this = this;
    this.workspace.registerButtonCallback('addThirdPartyBlockHandler', function() {
      let fileDom = document.getElementById('__openM5BBox');
      fileDom.click();
      fileDom.onchange = (ev) => {
        if (ev.target['files'].length === 0) return;
        let reader = new FileReader();
        reader.readAsText(ev.target['files'][0], "utf8");
        reader.onload = (e) => {
          let dataStr = e.target['result'];
          try {
            let data = JSON.parse(dataStr);
            let toolboxDom = document.getElementById(opts.toolboxId);
            eval(data.jscode);
            toolboxDom.children[toolboxDom.children.length -1].append(window['Blockly'].Xml.textToDom(`<category name="${data.category}" colour="${data.color}">${data.blocks.map(b => `<block type="${b}"></block>`).join('')}</category>`));
            let tempBlock = window['Blockly'].Xml.workspaceToDom(window['BlocklyEditor']);
           _this.storeSrv.loddingMODE.next(true);
            _this.init(opts, function(){
              window['BlocklyEditor'].clear();
              window['Blockly'].Xml.domToWorkspace(tempBlock, window['BlocklyEditor']);

            });
            // 加载 自定义块文件后不显示组件和units问题
            setTimeout(() => {
              _this.storeSrv.componentList.next(_this.storeSrv.componentList.value);
              _this.storeSrv.unitList.next(_this.storeSrv.unitList.value);
            }, 1100);
            ev.target['value'] = null;
          } catch(err) {
            console.log(err)
          }
        }
      }
    });
    this.workspace.registerButtonCallback('goToBlockMakerHandler', function() {
      window.open('http://block-maker.m5stack.com');
    });
  }
}
