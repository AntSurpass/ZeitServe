import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../../services/store.service';


@Component({
  selector: 'app-newsdetails',
  templateUrl: './newsdetails.component.html',
  styleUrls: ['./newsdetails.component.scss']
})
export class NewsdetailsComponent implements OnInit {
  item;
  constructor(private route: ActivatedRoute, private storeService: StoreService) { }

  ngOnInit() {
    this.getnewItem();
  }

  getnewItem() {
    const id = this.route.snapshot.paramMap.get('id');
    this.storeService.getNewsItem(id).subscribe(res => {
      if (res.data.cover === '/images/blank/no-cover.jpg') {
        res.data.cover = '/images/blank/no-cover.jpg';
      } else {
        res.data.cover = `/images/news/${res.data.cover}`;
      }
      this.item = res.data;
    });
  }

}
