import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt'
import {environment} from '../../../environments/environment';
import {ApiOptions} from '../config/api.config';
@Injectable()
export class CustomTranslatesService {

  getTranslate(key: string, area: string) {


    return area + "." + key;
  }
}
