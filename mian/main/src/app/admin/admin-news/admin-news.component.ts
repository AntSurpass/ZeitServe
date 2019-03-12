import { Component, OnInit } from '@angular/core';
import { AdminService, News } from '../admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-news',
  templateUrl: './admin-news.component.html',
  styleUrls: ['./admin-news.component.scss']
})
export class AdminNewsComponent implements OnInit {

  newsList: News[] = [];

  constructor(private adminSrv: AdminService, private router: Router) { }

  ngOnInit() {
    this.adminSrv.getNewsList().subscribe(res => {
      this.newsList = res.json().data;
    }, err => {});
  }

  publish(news: News) {
    if(news.published) {
      // 取消发布
      this.adminSrv.cancelPublishedNews(news.newsId).subscribe(res => {
        let code = res.json().code;
        if(code === 1) {
          this.newsList.forEach(n => {
            if(n.newsId == news.newsId) {
              n.published = false;
            }
          });
        }
      }, err => console.log(err));
    } else {
      // 发布
      this.adminSrv.publishedNews(news.newsId).subscribe(res => {
        let code = res.json().code;
        if(code === 1) {
          this.newsList.forEach(n => {
            if(n.newsId == news.newsId) {
              n.published = true;
            }
          });
        }
      }, err => console.log(err));
    }
  }

  edit(news: News) {
    this.router.navigate(['/admin/news', news.newsId]);
  }

  delete(news: News) {
    this.adminSrv.deleteNewsById(news.newsId).subscribe(res => {
      let code = res.json().code;
      if(code === 1) {
        this.newsList.splice(this.newsList.findIndex(n => n.newsId === news.newsId), 1);
        // this.newsList = this.newsList.filter(news => news.newsId != news.newsId);
      }
    }, err => console.log(err));
  }

}
