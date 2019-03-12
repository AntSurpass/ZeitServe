import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AdminService, Video } from '../admin.service';
import { Router, ActivatedRoute } from '@angular/router';

const MODE = {
  CREATE: 'create',
  EDIT: 'edit'
}

@Component({
  selector: 'app-admin-new-video',
  templateUrl: './admin-new-video.component.html',
  styleUrls: ['./admin-new-video.component.scss']
})
export class AdminNewVideoComponent implements OnInit {

  mode = MODE.CREATE;

  video: Video;

  cover = '/images/blank/no-video.png';

  @ViewChild('titleBox') titleBox: ElementRef;
  @ViewChild('imgRef') imgRef: ElementRef;
  @ViewChild('coverBox') coverBox: ElementRef;
  @ViewChild('youkuBox') youkuBox: ElementRef;
  @ViewChild('youtubeBox') youtubeBox: ElementRef;

  constructor(private adminSrv: AdminService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      if(!data.video) return;
      this.mode = MODE.EDIT;
      let result = data.video.json();
      if(result.code === 1) {
        this.video = result.data;
        this.cover = this.video.cover+ '?v=' + Date.now();
      }
    }, () => {});
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
      if(this.mode === MODE.CREATE || this.cover.indexOf('/images/blank/no-video.png') > -1 ) {
        this.adminSrv.uploadImg('video-cover', file).subscribe(res => {
          let result = res.json();
          if(result.code === 1) {
            this.cover = result.data;
          }
        }, err => {});
      }
      else if(this.mode === MODE.EDIT && this.cover.indexOf('/images/blank/no-video.png') === -1) {
        this.adminSrv.updateImg('video-cover', this.video.cover, file).subscribe(res => {
          let result = res.json();
          if(result.code === 1) {
            console.log('Update cover');
            this.cover = this.cover + '?v=' + Date.now();
          }
        });
      }
      
    }
  }

  publish(isPublished) {
    let payload = {
      title: this.titleBox.nativeElement.value,
      youku: this.youkuBox.nativeElement.value,
      youtube: this.youtubeBox.nativeElement.value,
      cover: this.cover.indexOf('?v=') === -1 ? this.cover : this.cover.substring(0, this.cover.indexOf('?v=')),
      published: isPublished
    }

    if(payload.title === '' || (payload.youku === '' && payload.youtube === '')) return;

    if(this.mode === MODE.CREATE) {
      this.adminSrv.addVideo(payload).subscribe(res => {
        let result = res.json();
        if(result.code === -1) {
          this.router.navigateByUrl('/admin/login');
          return;
        }
        this.router.navigateByUrl('/admin/video');
      });
    }
    else if(this.mode === MODE.EDIT) {
      let v = Object.assign({}, payload, {
        videoId: this.video.videoId
      });
      this.adminSrv.updateVideo(v).subscribe(res => {
        let result = res.json();
        if(result.code === -1) {
          this.router.navigateByUrl('/admin/login');
          return;
        }
        this.router.navigateByUrl('/admin/video');
      });
    }
  }

}
