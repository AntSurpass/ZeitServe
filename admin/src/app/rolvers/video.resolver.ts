import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Video, AppService } from '../app.service';

@Injectable()
export class VideoResolver implements Resolve<Video> {

    constructor(private appSrv: AppService) {}

    resolve(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let id = router.params.id;
        return this.appSrv.getVideoById(id).pipe(
            map(res => res.data)
        ) as Observable<Video>;
    }    

}
