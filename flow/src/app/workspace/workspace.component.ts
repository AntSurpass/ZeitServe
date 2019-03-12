import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalOperatorService, StoreService } from '../services/services.module';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {

  mode$: Observable<string>;
  loddingMode = true;
  ismb = true;
  stack = false;
  constructor(private globalOperatorSrv: GlobalOperatorService, private storeSrv: StoreService) { }

  ngOnInit() {
    if (/Android|webOS|iPhone|BlackBerry/i.test(navigator.userAgent)) {
      this.stack = true;
    }
    this.mode$ = this.globalOperatorSrv.getMode();
    this.setlodding();
    this.storeSrv.getuiMode().subscribe( res => {
      this.ismb = res as boolean;
        //  if (/iPad|iPod/i.test(navigator.userAgent)) {
        //   this.ismb = false;
        //  }
    });
  }

  setlodding() {
    this.storeSrv.setLoddingMode().subscribe((mode) => {
      this.loddingMode = mode as boolean;
    });
  }

}
