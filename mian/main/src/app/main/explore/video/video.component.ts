import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { VideoItem } from '../../../common/interface/store';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
  constructor(private storeSev: StoreService) { }
  items: Array<VideoItem>;
  ngOnInit() {
    this.getallVideo();
  }
  getallVideo() {
    this.storeSev.getVideos().subscribe( res => {
      this.items = res.data.map((item) => {
        if (item.cover === '/images/blank/no-video.jpg') {
          item.cover = '/images/blank/no-video.jpg';
        } else {
          item.cover = `/images/video/${item.cover}`;
        }
        return item;
      });
    });
  }
}
