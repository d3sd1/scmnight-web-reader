import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt'
import {environment} from '../../../environments/environment';
import {ApiOptions} from '../config/api.config';
import {SessionService} from "./session.service";
@Injectable()
export class ApiService {

    constructor(private http: HttpClient, private sessMan:SessionService) {}

    post(url: string, data: any): Observable<any> {
        return this.http.post<any>(environment.baseUrl + url, JSON.stringify(data), {
            headers: new HttpHeaders({'Content-Type': 'application/json'}).set(ApiOptions.headerName, ApiOptions.authScheme + this.sessMan.getToken())
        });

    }
    put(url: string, data: any): Observable<any> {
        return this.http.put<any>(environment.baseUrl + url, JSON.stringify(data), {
            headers: new HttpHeaders({'Content-Type': 'application/json'}).set(ApiOptions.headerName, ApiOptions.authScheme + this.sessMan.getToken())
        });
    }
    get(url: string): Observable<any> {
        return this.http.get<any>(environment.baseUrl + url, {
            headers: new HttpHeaders().set(ApiOptions.headerName, ApiOptions.authScheme + this.sessMan.getToken())
        });
    }
    del(url: string, data: any = null): Observable<any> {
      return this.http.request<any>('delete', environment.baseUrl + url, {
        headers: new HttpHeaders().set(ApiOptions.headerName, ApiOptions.authScheme + this.sessMan.getToken()),
        body: data
      });
    }
}
