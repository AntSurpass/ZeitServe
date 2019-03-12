import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService, Product } from '../admin.service';

const MODE = {
  CREATE: 'create',
  EDIT: 'edit'
}

@Component({
  selector: 'app-admin-new-product',
  templateUrl: './admin-new-product.component.html',
  styleUrls: ['./admin-new-product.component.scss']
})
export class AdminNewProductComponent implements OnInit {

  mode = MODE.CREATE;

  product: Product;
  
  cover = '/images/blank/no-cover.jpg';

  @ViewChild('titleBox') titleBox: ElementRef;

  @ViewChild('typeForm') typeForm: ElementRef;

  @ViewChild('quill') quill;

  constructor(private adminSrv: AdminService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      if(!data.product) return;
      this.mode = MODE.EDIT;
      let result = data.product.json();
      if(result.code === 1) {
        this.product = result.data;
        this.cover = this.product.cover + '?v=' + Date.now();
        setTimeout(() => {
          this.quill.quillEditor.container.firstChild.innerHTML = this.product.html;
          this.typeForm.nativeElement[+this.product.type - 1].checked = true;
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
      case this.typeForm.nativeElement[3].checked:
        type = this.typeForm.nativeElement[3].value;
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
      this.adminSrv.addProduct(data).subscribe(res => {
        let data = res.json();
        if(data.code === -1) {
          this.router.navigateByUrl('/admin/login');
          return;
        }
        this.router.navigateByUrl('/admin/product');
      });
    }
    else if(this.mode === MODE.EDIT) {
      let product = Object.assign({}, this.product, data);
      this.adminSrv.updateProduct(product).subscribe(res => {
        let data = res.json();
        if(data.code === -1) {
          this.router.navigateByUrl('/admin/login');
          return;
        }
        this.router.navigateByUrl('/admin/product');
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
        this.adminSrv.uploadImg('product-cover', file).subscribe(res => {
          let result = res.json();
          if(result.code === 1) {
            this.cover = result.data;
          }
        }, err => {});
      }
      else if(this.mode === MODE.EDIT && this.cover.indexOf('/images/blank/no-cover.jpg') === -1) {
        this.adminSrv.updateImg('product-cover', this.product.cover, file).subscribe(res => {
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
