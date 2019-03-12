import { Component, OnInit, Renderer2 } from '@angular/core';
import { headerAnimation } from '../../common/animations/headerAnimation';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [headerAnimation]
})
export class HeaderComponent implements OnInit {

  constructor() { }
  hide = false;
  ngOnInit() {

  }


}
