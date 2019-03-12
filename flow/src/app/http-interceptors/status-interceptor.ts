import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UploadService } from '../services/upload.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class StatusInterceptor implements HttpInterceptor {

  constructor(private uploadSrv: UploadService) {}

  /** 检查设备状态 */
  private checkStatus(req: HttpRequest<any>, next: HttpHandler, sub: Subject<any>) {
    this.uploadSrv.getDeviceStatus().toPromise()
    .then(flag => {
      if(flag.data !== false) {
        next.handle(req).pipe(
          tap(data => {
            sub.next(data);
            return data;
          }, err => {
            sub.error(err);
          })
        ).subscribe()
      }
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    const subject = new Subject<any>();
    if(req.url.indexOf(environment.apiUrl) === -1 ||
        req.url.indexOf('isHardwareConnected') > -1 ||
        req.url.indexOf('getFlowInfo') > -1) {
      return next.handle(req);
    }
    this.checkStatus(req, next, subject);
    return subject;
  }
}
