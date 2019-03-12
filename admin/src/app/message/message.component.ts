import { Component, OnInit } from '@angular/core';
import { AppService, Message } from '../app.service';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

    messages: Message[] = [];

    loading = true;

    constructor(private appSrv: AppService) {}
    
    ngOnInit() {
        this.getMessages();
    }

    private getMessages() {
        this.appSrv.getMessages().subscribe(res => {
            this.loading = false;
            if(res.code == 1) {
                this.messages = res.data;
            }
        }, err => null);
    }

}