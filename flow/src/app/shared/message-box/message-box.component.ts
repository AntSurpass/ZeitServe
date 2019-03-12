import { Component, OnInit } from '@angular/core';
import { MESSAGE_TYPE } from 'src/app/utils/common-data';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit {

  message: string = '';

  type: string = MESSAGE_TYPE.SUCCESS;

  timer = null;

  constructor() { }

  ngOnInit() {
  }

  success(msg: string) {
    this.type = MESSAGE_TYPE.SUCCESS;
    this.message = msg;

    this.timer = setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  error(msg: string) {
    this.type = MESSAGE_TYPE.ERROR;
    this.message = msg;

    this.timer = setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  loading(msg: string) {
    this.type = MESSAGE_TYPE.LOADING;
    this.message = msg;

    this.timer = setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  warning(msg: string) {
    this.type = MESSAGE_TYPE.WARNING;
    this.message = msg;

    this.timer = setTimeout(() => {
      this.message = '';
    }, 3000);
  }

}
