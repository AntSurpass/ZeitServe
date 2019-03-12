import { Component, OnInit } from '@angular/core';
import { AppService, News } from '../app.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

    news: News[] = [];

    loading = true;

    constructor(private appSrv: AppService, private msg: NzMessageService, private router: Router) {}
    
    ngOnInit() {
        this.getNews();
    }

    private getNews() {
        this.appSrv.getNews().subscribe(res => {
            this.loading = false;
            if(res.code == 1) {
                this.news = res.data;
            }
        }, err => null);
    }

    confirmDelete(id) {
        this.appSrv.removeNews(id).subscribe(res => {
            if(res.code == 1) {
                this.msg.success('删除资讯成功');
                this.news = this.news.filter(news => news.newsId !== id);
            }
        });
    }

    publish(news: News) {
        this.appSrv.updateNewsPublishedStatus(news.newsId, !news.published ? 1 : 0).subscribe(res => {
            if(res.code == 1) {
                this.msg.success(!news.published?'资讯发布成功':'资讯已取消发布');
                this.news.forEach(_news => {
                    if(_news.newsId === news.newsId) {
                        _news.published = !_news.published;
                    }
                });
            }
        });
    }

    edit(id) {
        this.router.navigateByUrl(`/admin/news/${id}`);
    }

}