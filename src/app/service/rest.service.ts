import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { GlobalsVar } from '../globals/globals';

@Injectable()
export class RESTService extends BaseRequestOptions {

    private apiUrl: string;

    public static handleError(error: any) {
        console.log(' ->Exception: RESTService: handleError: ', error);
        return Observable.throw('Error');
    }

    public static generateOptions(auth: string): RequestOptions {
        let aux = new RequestOptions();
        aux.headers = new Headers();
        aux.headers.append('authorization', auth);

        return aux;
    }

    constructor(protected http: Http, private globals: GlobalsVar) {
        super();
        this.apiUrl = this.globals.apiUrl;
    }

    get(resource: string, options: RequestOptions): Observable<Response> {

        let url = this.apiUrl + resource;
        return new Observable<Response>(
            (observer: any) => {
                this.http.get(url, options).subscribe((r: Response) => {
                    observer.next(r);
                    observer.complete();
                },
                    (e: Response) => {
                        RESTService.handleError(e);
                        observer.error(e);
                    });
            }
        );
    }

    post(resource: string, body: any, options: RequestOptions): Observable<Response> {

        let url = this.apiUrl + resource;

        return new Observable<Response>(
            (observer: any) => {
                this.http.post(url, body, options).subscribe((r: Response) => {
                    observer.next(r);
                    observer.complete();
                },
                    (e: Response) => {
                        RESTService.handleError(e);
                        observer.error(e);
                    });
            });
    }
}
