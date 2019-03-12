import { Injectable } from '@angular/core';
import * as ace from 'ace-builds';
import { CodeMakerService } from './code-maker.service';

interface AceOpts {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class CodeEditorService {

  /** 代码模式工作区 */
  public workspace;

  constructor(private codeMakerSrv: CodeMakerService) { }

  /**
   * 初始化代码编辑器
   * @param opts 配置对象
   */
  init(opts: AceOpts) {
    ace.config.set('basePath', '/assets/ace-builds');
    ace.config.loadModule('ace/ext/language_tools', (m) => {
      this.workspace.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
      });
    });

    this.workspace = ace.edit(opts.id, {
      mode: 'ace/mode/python',
      theme: 'ace/theme/diy',
      fontSize: 16
    });
    this.workspace.$blockScrolling = Infinity;

    window['CodeEditor'] = this.workspace;
  }

  /**
   * 更新代码
   */
  updateWorkspaceValue() {
    let code = this.codeMakerSrv.makeCode();
    if(code === '') return;
    this.workspace.setValue(code, -1);
  }
}
