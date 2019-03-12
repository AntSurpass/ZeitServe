import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CodeEditorService } from 'src/app/services/services.module';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements OnInit {

  @ViewChild('wrapperCodeEditor') wrapperCodeEditor: ElementRef;

  constructor(private codeEditorSrv: CodeEditorService) { }

  ngOnInit() {
    this.codeEditorSrv.init({id: this.wrapperCodeEditor.nativeElement.id});
  }

}
