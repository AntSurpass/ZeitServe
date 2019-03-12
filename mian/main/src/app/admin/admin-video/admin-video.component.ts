import { Component, OnInit } from '@angular/core';
import { AdminService, Video } from '../admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-video',
  templateUrl: './admin-video.component.html',
  styleUrls: ['./admin-video.component.scss']
})
export class AdminVideoComponent implements OnInit {

  videoList: Video[] = [];

  constructor(private adminSrv: AdminService, private router: Router) { }

  ngOnInit() {
    this.adminSrv.getVideoList().subscribe(res => {
      let result = res.json();
      if(result.code === 1) {
        this.videoList = result.data;
      }
    }, err => {});
  }

  handleRemove(video) {
    this.adminSrv.deleteVideo(video.videoId).subscribe(res => {
      let result = res.json();
      if(result.code === 1) {
        this.videoList = this.videoList.filter(v => v.videoId !== video.videoId);
      }
    });
  }

  handlePublish(video) {
    if(video.published) {
      this.adminSrv.cancelPublishedVideo(video.videoId).subscribe(res => {
        let result = res.json();
        if(result.code == 1) {
          this.videoList.forEach(v => {
            if(v.videoId == video.videoId) {
              v.published = false;
            }
          });
        }
      });
    } else {
      this.adminSrv.publishedVideo(video.videoId).subscribe(res => {
        let result = res.json();
        if(result.code == 1) {
          this.videoList.forEach(v => {
            if(v.videoId == video.videoId) {
              v.published = true;
            }
          });
        }
      });
    }
  }

  edit(video) {
    this.router.navigate(['/admin/video', video.videoId]);
  }

}
