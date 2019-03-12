import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { StatusInterceptor } from './status-interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: StatusInterceptor, multi: true },
];
