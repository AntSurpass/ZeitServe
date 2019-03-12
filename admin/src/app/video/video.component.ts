import { Component, OnInit } from '@angular/core';
import { AppService, Video } from '../app.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

    videos: Video[] = [];

    loading = true;

    constructor(private appSrv: AppService, private msg: NzMessageService, private router: Router) {}
    
    ngOnInit() {
        this.getVideos();
    }

    private getVideos() {
        this.appSrv.getVideos().subscribe(res => {
            this.loading = false;
            if(res.code == 1) {
                this.videos = res.data;
            }
        });
    }

    confirmDelete(id) {
        this.appSrv.removeVideo(id).subscribe(res => {
            if(res.code == 1) {
                this.msg.success('删除视频信息成功');
                this.videos = this.videos.filter(video => video.videoId !== id);
            }
        });
    }

    publish(video: Video) {
        this.appSrv.updateVideoPublishedStatus(video.videoId, !video.published ? 1 : 0).subscribe(res => {
            if(res.code == 1) {
                this.msg.success(!video.published?'视频发布成功':'视频已取消发布');
                this.videos.forEach(_video => {
                    if(_video.videoId === video.videoId) {
                        _video.published = !_video.published;
                    }
                });
            }
        });
    }

    edit(id) {
        this.router.navigateByUrl(`/admin/video/${id}`);
    }

}