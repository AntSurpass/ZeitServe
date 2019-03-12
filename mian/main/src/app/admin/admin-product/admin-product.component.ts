import { Component, OnInit } from '@angular/core';
import { AdminService, Product } from '../admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss']
})
export class AdminProductComponent implements OnInit {

  productList: Product[] = [];

  constructor(private adminSrv: AdminService, private router: Router) { }

  ngOnInit() {
    this.adminSrv.getProductList().subscribe(res => {
      this.productList = res.json().data;
    }, err => {});
  }

  publish(product: Product) {
    if(product.published) {
      // 取消发布
      this.adminSrv.cancelPublishedProduct(product.productId).subscribe(res => {
        let code = res.json().code;
        if(code === 1) {
          this.productList.forEach(p => {
            if(p.productId == product.productId) {
              p.published = false;
            }
          });
        }
      }, err => console.log(err));
    } else {
      // 发布
      this.adminSrv.publishedProduct(product.productId).subscribe(res => {
        let code = res.json().code;
        if(code === 1) {
          this.productList.forEach(p => {
            if(p.productId == product.productId) {
              p.published = true;
            }
          });
        }
      }, err => console.log(err));
    }
  }

  edit(product: Product) {
    this.router.navigate(['/admin/product', product.productId]);
  }

  delete(product: Product) {
    this.adminSrv.deleteProductById(product.productId).subscribe(res => {
      let code = res.json().code;
      if(code === 1) {
        this.productList.splice(this.productList.findIndex(p => p.productId === product.productId), 1);
        // this.productList = this.productList.filter(p => p.productId != product.productId);
      }
    }, err => console.log(err));
  }

}
