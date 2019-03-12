import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { drowAnimation } from '../../common/animations/drowTabAnimation';
import { StoreService } from '../../services/store.service';
import { News, Products } from '../../common/interface/store';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    drowAnimation
  ]
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('video') video: ElementRef;

  items: Array<News>;
  products: Array<Products>;
  core;
  module;
  unit;
  application;
  caseList: string[];
  brandList: string[];
  public isopen = '';
  constructor(private storeSev: StoreService) {
  }
  ngOnInit() {
    this.getallNews();
  }
  trigger(e) {
    if (e === this.isopen) {
      this.isopen = 'void';
    } else {
      this.isopen = e;
    }
  }
  ngAfterViewInit(): void {
  }

  getallNews() {
    this.storeSev.getNews().subscribe(res => {
      this.items = res.data.map((item) => {
        if (item.cover === '/images/blank/no-cover.jpg') {
          item.cover = '/images/blank/no-cover.jpg';
        } else {
          item.cover = `/images/news/${item.cover}`;
        }
        return item;
      }).slice(0, 4);
    });
    this.storeSev.getProducts().subscribe(res => {
      this.products  = res.data.map((item) => {
        if (item.cover === '/images/blank/no-cover.jpg') {
          item.cover = '/images/blank/no-cover.jpg';
        } else {
          item.cover = `/images/product/${item.cover}`;
        }
        return item;
      });
      this.core = this.products.filter( (item) => {
        return item.type === 1;
      }).slice(0, 3);
      this.module = this.products.filter( (item) => {
        return item.type === 3;
      }).slice(0, 3);
      this.unit = this.products.filter( (item) => {
        return item.type === 2;
      }).slice(0, 3);
      this.application = this.products.filter( (item) => {
        return item.type === 4;
      }).slice(0, 3);
    });

    this.storeSev.getImages('case').subscribe( res => {
      res.data =  res.data.map((item) => {
          item = `/images/case/${item}`;
          return item;
      });
      this.caseList  = res.data;
    });
    this.storeSev.getImages('brand').subscribe( res => {
       res.data = res.data.map((item) => {
          item = `/images/brand/${item}`;
          return item;
      });
      this.brandList  = res.data;
    });
  }
}

