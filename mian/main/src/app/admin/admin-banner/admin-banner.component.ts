import { Component, OnInit, ElementRef } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-banner',
  templateUrl: './admin-banner.component.html',
  styleUrls: ['./admin-banner.component.scss']
})
export class AdminBannerComponent implements OnInit {

  imageType = {
    productBanner: 'banner-product',
    newsBanner: 'banner-news',
    contact: 'banner-contact',
    stem: 'banner-stem',
    uiflow: 'banner-uiflow',
    linkUiflow: 'link-uiflow',
    linkStem: 'link-stem',
    case: 'case-list',
    brand: 'brand-list',
    product: 'product-cover',
    news: 'news-cover',
    video: 'video-cover'
  }

  imageList = [];

  brandList = [];

  constructor(private adminSrv: AdminService) { }

  ngOnInit() {
    this.adminSrv.getImageList('case').subscribe(res => {
      let result = res.json();
      if(result.code === 1) {
        this.imageList = result.data.map(img => {
          return {
            name: './images/case/' + img,
            base64: ''
          }
        });
      }
    }, err => {});

    this.adminSrv.getImageList('brand').subscribe(res => {
      let result = res.json();
      if(result.code === 1) {
        this.brandList = result.data.map(img => {
          return {
            name: './images/brand/' + img,
            base64: ''
          }
        });
      }
    }, err => {});
  }

  handleError(ev) {
    // Error picture
    // ev.target.src = '../../assets/images/no_photo.png';
  }

  handleImgClick(imgRef, type, fileBox) {
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
      this.adminSrv.uploadImg(type, file).subscribe(res => {
        let result = res.json();
        if(result.code === 1) {
          let fr = new FileReader();
          fr.onload = function() {
            imgRef.target.src = this.result;
          }
          fr.readAsDataURL(file);
        }
      }, err => {});
    }
  }

  handleInsertImgs(type, fileBox) {
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
      let __this = this;
      this.adminSrv.uploadImg(type, file).subscribe(res => {
        let result = res.json();
        if(result.code === 1) {
          let fr = new FileReader();
          fr.onload = function() {
            if(type === __this.imageType.case) {
              __this.imageList.push({
                base64: this.result,
                name: './images/case/' + result.data
              });
            }
            else if(type === __this.imageType.brand) {
              __this.brandList.push({
                base64: this.result,
                name: './images/brand/' + result.data
              });
            }
          }
          fr.readAsDataURL(file);
        }
      }, err => {});
    }
  }

  handleDeleteImg(type, img) {
    let name = '';
    switch(type) {
      case this.imageType.case:
        name = img.name.replace(/.\/images\/case\//g, '');
        break;
      case this.imageType.brand:
        name = img.name.replace(/.\/images\/brand\//g, '');
        break;
      default:
        return;
    }
    this.adminSrv.deleteImg(type, name).subscribe(res => {
      let result = res.json();
      if(result.code === 1) {
        switch(type) {
          case this.imageType.case:
            this.imageList.splice(this.imageList.findIndex(c => c.name == img.name), 1);
            break;
          case this.imageType.brand:
            this.brandList.splice(this.brandList.findIndex(b => b.name == img.name), 1);
            break;
        }
      }
    });
  }

}
