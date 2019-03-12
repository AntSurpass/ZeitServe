import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService, News } from '../admin.service';

const MODE = {
  CREATE: 'create',
  EDIT: 'edit'
}

@Component({
  selector: 'app-admin-new-news',
  templateUrl: './admin-new-news.component.html',
  styleUrls: ['./admin-new-news.component.scss']
})
export class AdminNewNewsComponent implements OnInit {

  mode = MODE.CREATE;

  news: News;

  cover = '/images/blank/no-cover.jpg';

  @ViewChild('titleBox') titleBox: ElementRef;

  @ViewChild('typeForm') typeForm: ElementRef;

  @ViewChild('quill') quill;

  constructor(private adminSrv: AdminService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      if(!data.news) return;
      this.mode = MODE.EDIT;
      let result = data.news.json();
      if(result.code === 1) {
        this.news = result.data;
        this.cover = this.news.cover + '?v=' + Date.now();
        setTimeout(() => {
          this.quill.quillEditor.container.firstChild.innerHTML = this.news.html;
          this.typeForm.nativeElement[+this.news.type - 1].checked = true;
        });
      }
    }, () => {});
  }

  publish(isPublish) {
    let title = this.titleBox.nativeElement.value;
    let content = this.quill.quillEditor.container.firstChild.innerHTML;
    let type = 1;
    switch(true) {
      case this.typeForm.nativeElement[0].checked:
        type = this.typeForm.nativeElement[0].value;
        break;
      case this.typeForm.nativeElement[1].checked:
        type = this.typeForm.nativeElement[1].value;
        break;
      case this.typeForm.nativeElement[2].checked:
        type = this.typeForm.nativeElement[2].value;
        break;
    }
    let publish = isPublish;
    let data = {
      title: title,
      html: content,
      type: type,
      published: publish,
      cover: this.cover.indexOf('?v=') === -1 ? this.cover : this.cover.substring(0, this.cover.indexOf('?v='))
    }
    if(data.title === '') return;
    if(this.mode === MODE.CREATE) {
      this.adminSrv.addNews(data).subscribe(res => {
        let data = res.json();
        if(data.code === -1) {
          this.router.navigateByUrl('/admin/login');
          return;
        }
        this.router.navigateByUrl('/admin/news');
      });
    }
    else if(this.mode === MODE.EDIT) {
      let news = Object.assign({}, this.news, data);
      this.adminSrv.updateNews(news).subscribe(res => {
        let data = res.json();
        if(data.code === -1) {
          this.router.navigateByUrl('/admin/login');
          return;
        }
        this.router.navigateByUrl('/admin/news');
      });
    }
  }

  handleUploadCover(imgRef, fileBox) {
    fileBox.click();
    fileBox.onchange = (ev) => {
      if (ev.target['files'].length === 0) {
        console.log('No file.');
        return;
      }
      if (ev.target['files'][0].name.replace(/.jpg/g, '').length > 10) {
        console.log('Unallowable file type.');
        return;
      }
      let file = ev.target['files'][0];
      if(this.mode === MODE.CREATE || this.cover.indexOf('/images/blank/no-cover.jpg') > -1) {
        this.adminSrv.uploadImg('news-cover', file).subscribe(res => {
          let result = res.json();
          if(result.code === 1) {
            this.cover = result.data;
          }
        }, err => {});
      }
      else if(this.mode === MODE.EDIT && this.cover.indexOf('/images/blank/no-cover.jpg') === -1) {
        this.adminSrv.updateImg('news-cover', this.news.cover, file).subscribe(res => {
          let result = res.json();
          if(result.code === 1) {
            console.log('Update cover');
            this.cover = this.cover + '?v=' + Date.now();
          }
        });
      }
    }
  }

}
