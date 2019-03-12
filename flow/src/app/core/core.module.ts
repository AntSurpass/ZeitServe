import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { QRCodeModule } from 'angularx-qrcode';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SettingPanelComponent } from './setting-panel/setting-panel.component';
import { ResourceManagerComponent } from './resource-manager/resource-manager.component';

@NgModule({
  imports: [SharedModule, QRCodeModule],
  declarations: [HeaderComponent, FooterComponent, SettingPanelComponent, ResourceManagerComponent],
  exports: [HeaderComponent, FooterComponent],
  entryComponents: [SettingPanelComponent, ResourceManagerComponent]
})
export class CoreModule { }
