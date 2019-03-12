import { Component, OnInit } from '@angular/core';
import { AppService, Product } from '../app.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

    products: Product[] = [];

    loading = true;

    constructor(private appSrv: AppService, private msg: NzMessageService, private router: Router) {}
    
    ngOnInit() {
        this.getProducts();
    }

    private getProducts() {
        this.appSrv.getProducts().subscribe(res => {
            this.loading = false;
            if(res.code == 1) {
                this.products = res.data;
            }
        });
    }

    confirmDelete(id) {
        this.appSrv.removeProduct(id).subscribe(res => {
            if(res.code == 1) {
                this.msg.success('删除产品信息成功');
                this.products = this.products.filter(product => product.productId !== id);
            }
        });
    }

    publish(product: Product) {
        this.appSrv.updateProductPublishedStatus(product.productId, !product.published ? 1 : 0).subscribe(res => {
            if(res.code == 1) {
                this.msg.success(!product.published?'产品发布成功':'产品已取消发布');
                this.products.forEach(_product => {
                    if(_product.productId === product.productId) {
                        _product.published = !_product.published;
                    }
                });
            }
        });
    }

    edit(id) {
        this.router.navigateByUrl(`/admin/product/${id}`);
    }

}