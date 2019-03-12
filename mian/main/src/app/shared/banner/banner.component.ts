import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation, Input } from '@angular/core';
import { style, transition } from '@angular/animations';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})


export class BannerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('bannerwapper') banner: ElementRef;
  @Input()  show: boolean;
  @Input()  count: number;
  constructor(private r2: Renderer2, private cdRef: ChangeDetectorRef, private storeSev: StoreService) {

  }
  x = 1;
  length;
  childList: any;
  caseList: string[];
  setTime;
  ngOnInit() {
    this.getIMG();
    this.setTime = setInterval(() => {
      this.next();
      this.cdRef.detectChanges();
    }, 3000);
  }
  ngAfterViewInit() {
    this.childList = this.banner.nativeElement.childNodes;
    this.cdRef.detectChanges();
  }
  getIMG() {
    this.storeSev.getImages('case').subscribe( res => {
      res.data =  res.data.map((item) => {
          item = `/images/case/${item}`;
          return item;
      });
      this.caseList  = res.data;
      this.length = res.data.length;
    });
  }
  pre() {
    if (this.x === 1) {
      this.r2.setStyle(this.banner.nativeElement, 'transform', `translateX(-${this.length - 1}00%)`);
      this.x = this.length;
      return;
    }
    this.r2.setStyle(this.banner.nativeElement, 'transform', `translateX(-${this.x - this.length + 1 }00%)`);
    this.x--;
  }
  next() {
    if (this.x === this.length) {
      this.r2.setStyle(this.banner.nativeElement, 'transform', `translateX(0)`);
      this.x = 1;
      return;
    }
    this.r2.setStyle(this.banner.nativeElement, 'transform', `translateX(-${this.x}00%)`);
    this.x++;
  }
  pointClick(i) {
    this.x = i ;
    this.cdRef.detectChanges();
    this.next();
  }
  mouseenter() {
    clearInterval(this.setTime);
  }
  mouseleave() {
    this.setTime = setInterval(() => {
      this.next();
    }, 3000);
  }
  ngOnDestroy(): void {
    clearInterval(this.setTime);
  }
}

