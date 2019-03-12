import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
   mode = {
     name: '',
     email: '',
     message: ''
   };
   showform = true;
  constructor(private storeSev: StoreService) { }
  ngOnInit() {
  }
  onSubmit() {
    this.storeSev.addMessage(this.mode).subscribe(res => {
      const code = res.code;
      if ( code === 1) {
        this.showform = false;
      }
      setTimeout(() => {
        this.showform = true;
      }, 2000);
    });
  }
}
