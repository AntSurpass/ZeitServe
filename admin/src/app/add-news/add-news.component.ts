import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UploadFile, NzMessageService } from 'ng-zorro-antd';
import { Observer, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NewsForm, AppService, News } from '../app.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.scss']
})
export class AddNewsComponent implements OnInit {

  mode = 'create';
  validateForm: FormGroup;
  loading = false;
  avatarUrl: string = 'https://web-admin.m5stack.com/cover.jpg';
  coverUrl: string = `https://web-admin.m5stack.com/cover.jpg`;
  postUrl: string = `${environment.apiUrl}/upload/news/cover`;
  news: News = null;
  headers = null;

  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private appSrv: AppService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    if(sessionStorage.getItem('m5-token') != null) {
      this.headers = {
        'm5-token': sessionStorage.getItem('m5-token')
      }
    }
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      link: [null, []],
      type: ['1', []],
      tab: ['', []],
      author: ['', []],
      create_time: [new Date(), []],
      video_link: ['', []]
    });

    this.activatedRoute.data.subscribe((data: {news: News}) => {
      if(data.news == undefined) return;
      this.mode = 'edit';
      this.news = data.news;
      this.validateForm.setValue({
        title: data.news.title,
        link: data.news.link,
        description: data.news.description,
        type: data.news.type.toString(),
        tab: data.news.tab || '',
        author: data.news.author || '',
        create_time: new Date(data.news.create_time) || new Date(),
        video_link: data.news.video_link
      });
      this.avatarUrl = data.news.cover;
      this.coverUrl = data.news.cover;
    });
  }

  submitForm(isPublished) {
    if(!this.validateForm.valid) {
      this.msg.error('信息不完整，添加失败');
      return;
    }
    let payload: NewsForm = {
      title: this.validateForm.value['title'],
      link: this.validateForm.value['link'],
      description: this.validateForm.value['description'],
      type: parseInt(this.validateForm.value['type']),
      tab: this.validateForm.value['tab'],
      author: this.validateForm.value['author'],
      create_time: this.validateForm.value['create_time'],
      cover: this.coverUrl,
      published: isPublished,
      video_link: this.validateForm.value['video_link']
    }
    if(this.mode === 'create') {
      this.appSrv.addNews(payload).subscribe(res => {
        if(res.code == 1) {
          this.msg.success('添加成功');
          this.router.navigateByUrl('/admin/news');
          return;
        }
        this.msg.error('添加失败,请重试');
      });
    } 
    else if(this.mode === 'edit'){
      this.appSrv.updateNews(Object.assign({}, this.news, payload)).subscribe(res => {
        if(res.code == 1) {
          this.msg.success('修改成功');
          this.router.navigateByUrl('/admin/news');
          return;
        }
        this.msg.error('添加失败,请重试');
      });
    }
  }

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      // const isJPG = file.type === 'image/jpeg';
      // if (!isJPG) {
      //   this.msg.error('You can only upload JPG file!');
      //   observer.complete();
      //   return;
      // }
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isLt20M) {
        this.msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      // check height
      this.checkImageDimension(file).then(dimensionRes => {
        if (!dimensionRes) {
          this.msg.error('Image only 300x300 above');
          observer.complete();
          return;
        }

        // observer.next(isJPG && isLt20M && dimensionRes);
        observer.next(isLt20M && dimensionRes);
        observer.complete();
      });
    });
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result.toString()));
    reader.readAsDataURL(img);
  }

  private checkImageDimension(file: File): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image(); // create image
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        window.URL.revokeObjectURL(img.src);
        // resolve(width === height && width >= 300);
        resolve(true);
      };
    });
  }

  handleChange(info: { file: UploadFile }): void {
    if (info.file.status === 'uploading') {
      if(!this.loading) {
        this.msg.loading('正在上传图片');
      }
      this.loading = true;
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      if(info.file.response.code == -100) {
        // 返回Login页面
        this.loading = false;
        this.msg.error('登陆超时,请重新登陆');
        return;
      }
      if(info.file.response.code == 0 || info.file.response.code == -1) {
        this.loading = false;
        this.msg.error('上传图片格式不合法');
        return;
      }
      this.getBase64(info.file.originFileObj, (img: string) => {
        this.loading = false;
        this.coverUrl = `https://web-admin.m5stack.com/cover/${info.file.response.data}`;
        this.msg.success('上传图片成功');
        this.avatarUrl = img;
      });
    }
    if (info.file.status === 'error') {
      this.loading = false;
      this.msg.error('上传图片失败');
    }
  }

}