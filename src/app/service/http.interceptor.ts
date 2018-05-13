import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { GlobalsVar } from '../globals/globals';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private globals: GlobalsVar) {
    }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        'Content-Type' : 'application/json; charset=utf-8',
        'Accept'       : 'application/json',
        'Authorization': this.globals.session ? this.globals.session : '123',
      },
    });

    return next.handle(req);
  }
}
