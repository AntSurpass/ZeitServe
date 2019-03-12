import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UploadFile, NzMessageService } from 'ng-zorro-antd';
import { Observer, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AppService, VideoForm, Video } from '../app.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.scss']
})
export class AddVideoComponent implements OnInit {

  mode = 'create';
  validateForm: FormGroup;
  loading = false;
  avatarUrl: string = 'https://web-admin.m5stack.com/cover.jpg';
  coverUrl: string = `https://web-admin.m5stack.com/cover.jpg`;
  postUrl: string = `${environment.apiUrl}/upload/video/cover`;
  video: Video = null;
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
      video_link: [null, []],
      create_time: [new Date(), []]
    });

    this.activatedRoute.data.subscribe((data: {video: Video}) => {
      if(data.video == undefined) return;
      this.mode = 'edit';
      this.video = data.video;
      this.validateForm.setValue({
        title: data.video.title,
        video_link: data.video.video_link,
        create_time: new Date(data.video.create_time) || new Date()
      });
      this.avatarUrl = data.video.cover;
      this.coverUrl = data.video.cover;
    });
  }

  submitForm(isPublished) {
    if(!this.validateForm.valid) {
      this.msg.error('信息不完整，添加失败');
      return;
    }
    let payload: VideoForm = {
      title: this.validateForm.value['title'],
      video_link: this.validateForm.value['video_link'],
      cover: this.coverUrl,
      published: isPublished,
      create_time: this.validateForm.value['create_time']
    }
    if(this.mode === 'create') {
      this.appSrv.addVideo(payload).subscribe(res => {
        if(res.code == 1) {
          this.msg.success('添加成功');
          this.router.navigateByUrl('/admin/video');
          return;
        }
        this.msg.error('添加失败,请重试');
      });
    }
    else if(this.mode === 'edit') {
      this.appSrv.updateVideo(Object.assign({}, this.video, payload)).subscribe(res => {
        if(res.code == 1) {
          this.msg.success('修改成功');
          this.router.navigateByUrl('/admin/video');
          return;
        }
        this.msg.error('修改成功,请重试');
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