import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalOperatorService, UiEditorService, StoreService } from 'src/app/services/services.module';

@Component({
  selector: 'app-ui-editor-mb',
  templateUrl: './ui-editor-mb.component.html',
  styleUrls: ['./ui-editor-mb.component.scss']
})
export class UiEditorMbComponent implements OnInit {
  @ViewChild('wrapperUIEditorMb') wrapperUIEditorMb: ElementRef;
  workspaceVisibility$: Observable<boolean>;
  constructor(private uiEditorSrv: UiEditorService, private globalOperatorSrv: GlobalOperatorService, private storeSrv: StoreService) { 
    this.workspaceVisibility$ = this.globalOperatorSrv.getUIVisibility();
  }

  ngOnInit() {
    this.wrapperUIEditorMb.nativeElement.addEventListener('touchmove', ev => ev.preventDefault());
    this.storeSrv.getType().subscribe( res => {
      this.uiEditorSrv.init(this.wrapperUIEditorMb.nativeElement.id, res);
    });
  }

}
