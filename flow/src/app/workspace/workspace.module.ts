import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { UiEditorComponent } from './ui-editor/ui-editor.component';
import { BlocklyEditorComponent } from './blockly-editor/blockly-editor.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { WorkspaceComponent } from './workspace.component';
import { PropertyPanelComponent } from './property-panel/property-panel.component';
import { PropertyItemComponent } from './property-item/property-item.component';
import { UnitModalComponent } from './unit-modal/unit-modal.component';
import { UnitPropertyPanelComponent } from './unit-property-panel/unit-property-panel.component';
import { UiEditorMbComponent } from './ui-editor-mb/ui-editor-mb.component';

@NgModule({
  imports: [
    SharedModule,
    ColorPickerModule
  ],
  declarations: [UiEditorComponent, BlocklyEditorComponent, CodeEditorComponent, WorkspaceComponent, PropertyPanelComponent, PropertyItemComponent, UnitModalComponent, UnitPropertyPanelComponent,UiEditorMbComponent],
  exports: [WorkspaceComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class WorkspaceModule { }
