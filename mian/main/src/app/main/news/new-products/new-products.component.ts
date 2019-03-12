import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { News } from '../../../common/interface/store';
@Component({
  selector: 'app-new-products',
  templateUrl: './new-products.component.html',
  styleUrls: ['./new-products.component.scss']
})
export class NewProductsComponent implements OnInit {
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
      });
    });
}
}
