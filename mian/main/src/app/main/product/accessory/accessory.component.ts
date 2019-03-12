import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { Products } from '../../../common/interface/store';

@Component({
  selector: 'app-accessory',
  templateUrl: './accessory.component.html',
  styleUrls: ['./accessory.component.scss']
})
export class AccessoryComponent implements OnInit {
  items: Array<Products>;
  constructor(private storeSev: StoreService) { }

  ngOnInit() {
    this.getallProducts();
  }
  getallProducts() {
    this.storeSev.getProducts().subscribe( res => {
      this.items  = res.data.map((item) => {
        if (item.cover === '/images/blank/no-cover.jpg') {
          item.cover = '/images/blank/no-cover.jpg';
        } else {
          item.cover = `/images/product/${item.cover}`;
        }
        return item;
      }).filter( data => data.type === 4);
    });
  }
}
