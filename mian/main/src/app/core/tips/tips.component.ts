import { Component, OnInit, Renderer2, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.scss']
})
export class TipsComponent implements OnInit, AfterViewInit{


  scrollend;
  constructor(private red2: Renderer2) { }
  ngOnInit() {
    // this.hideTip();

  }
  ngAfterViewInit(): void {
  }
  toTop() {
    let timer;
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(function fn() {
      const oTop = document.body.scrollTop || document.documentElement.scrollTop;
      if (oTop > 0) {
        scrollTo(0, oTop - 80);
        // document.body.scrollTop =  document.documentElement.scrollTop = oTop - 100;
        requestAnimationFrame(fn);
      } else {
        cancelAnimationFrame(timer);
      }
    });
  }
  hideTip() {
    let pageheight = document.documentElement.clientHeight;
    let htmlheight = document.documentElement.offsetHeight - 100;
    // console.log( pageheight, htmlheight, 66);
    if (document.documentElement.scrollTop + pageheight > htmlheight) {
      this.scrollend = true;
    }
    this.red2.listen('window', 'scroll', this.throttle(() => {
       pageheight = document.documentElement.clientHeight;
       htmlheight = document.documentElement.offsetHeight - 100;
      const scrollheight = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollheight + pageheight > htmlheight) {
        this.scrollend = true;
      } else {
        this.scrollend = false;
      }
    }, 0));
  }

  throttle(fn, wait) {
    var time = Date.now();
    return function () {
      if ((time + wait - Date.now()) < 0) {
        fn();
        time = Date.now();
      }
    };
  }
}
