import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { News, AdminService } from './admin.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AdminNewsResolver implements Resolve<News> {

    constructor(private adminSrv: AdminService) {

    }

    resolve(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let id = router.params.id;
        return this.adminSrv.getNewsById(id).pipe(
            catchError(err => null)
        ) as Observable<any>;
    }
}