import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../../../services/store.service';
import { News } from '../../../common/interface/store';

@Component({
  selector: 'app-whole',
  templateUrl: './whole.component.html',
  styleUrls: ['./whole.component.scss']
})
export class WholeComponent implements OnInit {
  items: Array<News>;
  constructor( private router: Router, private storeSev: StoreService) { }

  ngOnInit() {
    this.getallNews();
  }

  getallNews() {
    this.storeSev.getNews().subscribe( res => {
      this.items = res.data.map((item) => {
        if (item.cover === '/images/blank/no-cover.jpg') {
          item.cover = '/images/blank/no-cover.jpg';
        } else {
          item.cover = `/images/news/${item.cover}`;
        }
        return item;
      });
    });
  }
}
