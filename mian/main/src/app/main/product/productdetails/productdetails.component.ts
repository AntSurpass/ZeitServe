import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-productdetails',
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.scss']
})
export class ProductdetailsComponent implements OnInit {
  item;
  constructor(private route: ActivatedRoute, private storeService: StoreService) { }
  ngOnInit() {
    this.getnewItem();
  }
  getnewItem() {
    const id = this.route.snapshot.paramMap.get('id');
    this.storeService.getProductsItem(id).subscribe(res => {
      if (res.data.cover === '/images/blank/no-cover.jpg') {
        res.data.cover = '/images/blank/no-cover.jpg';
      } else {
        res.data.cover = `/images/product/${res.data.cover}`;
      }
      this.item = res.data;
    });
  }


}
