import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { News, AppService } from '../app.service';

@Injectable()
export class NewsResolver implements Resolve<News> {

    constructor(private appSrv: AppService) {}

    resolve(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let id = router.params.id;
        return this.appSrv.getNewsById(id).pipe(
            map(res => res.data)
        ) as Observable<News>;
    }    

}
