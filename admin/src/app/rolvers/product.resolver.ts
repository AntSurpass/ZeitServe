import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, AppService } from '../app.service';

@Injectable()
export class ProductResolver implements Resolve<Product> {

    constructor(private appSrv: AppService) {}

    resolve(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let id = router.params.id;
        return this.appSrv.getProductById(id).pipe(
            map(res => res.data)
        ) as Observable<Product>;
    }    

}