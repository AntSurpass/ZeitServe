import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { News } from '../../../common/interface/store';
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  items: Array<News>;
  constructor( private storeSev: StoreService) { }

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
      }).filter(data => data.type === 1);
    });
}
}
