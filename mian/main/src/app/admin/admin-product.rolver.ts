import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Product, AdminService } from './admin.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AdminProductResolver implements Resolve<Product> {

    constructor(private adminSrv: AdminService) {

    }

    resolve(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let id = router.params.id;
        return this.adminSrv.getProductById(id).pipe(
            catchError(err => null)
        ) as Observable<any>;
    }
}