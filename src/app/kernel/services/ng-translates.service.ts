import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt'
import {environment} from '../../../environments/environment';
import {ApiOptions} from '../config/api.config';
import {CustomTranslate} from "../model/custom-translate";
import {ApiService} from "./api.service";
import {deserialize} from "json-typescript-mapper";
import {WsService} from "./ws.service";
import {User} from "../model/user";
import {SessionSingleton} from "../singletons/session.singleton";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class NgTranslatesService {

  constructor(private translate:TranslateService) {

  }
  setTranslate(lang) {
    if(environment.availableLangs.findIndex(x => x == lang) !== -1) {
      this.translate.setDefaultLang(lang);
      this.translate.use(lang);
    }
    else {
      this.translate.setDefaultLang(environment.availableLangs[0]);
      this.translate.use(environment.availableLangs[0]);
      console.debug("Language not supported on ng: " + lang);
    }
  }
  setOnlyDefaultLang(lang) {
    if(environment.availableLangs.findIndex(x => x == lang) !== -1) {
      this.translate.setDefaultLang(lang);
    }
    else {
      this.translate.setDefaultLang(environment.availableLangs[0]);
      console.debug("Language not supported on ng: " + lang);
    }
  }
}
