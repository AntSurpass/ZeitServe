import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalOperatorService, UiEditorService, StoreService } from 'src/app/services/services.module';

@Component({
  selector: 'app-ui-editor',
  templateUrl: './ui-editor.component.html',
  styleUrls: ['./ui-editor.component.scss']
})
export class UiEditorComponent implements OnInit {

  @ViewChild('wrapperUIEditor') wrapperUIEditor: ElementRef;

  workspaceVisibility$: Observable<boolean>;

  constructor(private uiEditorSrv: UiEditorService, private globalOperatorSrv: GlobalOperatorService, private storeSrv: StoreService) {
    this.workspaceVisibility$ = this.globalOperatorSrv.getUIVisibility();
  }

  ngOnInit() {
    this.wrapperUIEditor.nativeElement.addEventListener('touchmove', ev => ev.preventDefault());
    this.storeSrv.getType().subscribe( res => {
      this.uiEditorSrv.init(this.wrapperUIEditor.nativeElement.id, res);
    });
  }

  toggleVisibility() {
    this.globalOperatorSrv.setSelectedUnit(null);
    this.globalOperatorSrv.setSelectedComponent(null);
    this.globalOperatorSrv.setUIVisibility(!this.globalOperatorSrv.UIVisibility.value);
  }

}
