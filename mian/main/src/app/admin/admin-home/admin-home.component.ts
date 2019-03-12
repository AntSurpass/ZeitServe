import { Component, OnInit } from '@angular/core';
import { Message, AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {

  messageList: Message[] = [];

  constructor(private adminSrv: AdminService) { }

  ngOnInit() {
    this.adminSrv.getMessageList().subscribe(res => {
      let result = res.json();
      if(result.code === 1) {
        this.messageList = result.data;
      }
    }, err => {});
  }

}
