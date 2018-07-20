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

@Injectable()
export class CustomTranslatesService {
  private translates: Array<CustomTranslate> = new Array<CustomTranslate>();
  private advisedNotFoundTranslates: Array<string> = new Array<string>();
  private loadedTranslates = false;

  constructor(private api: ApiService, private ws: WsService, private singleton: SessionSingleton) {
    this.ws.subscribe("scm/translations", this.onLangManage.bind(this));
    this.retTranslates();
  }

  private onLangManage(uri: any, data: any) {
    this.retTranslates();
  }

  defaultLangTranslate(key_id: string) {
    let translationIdx = this.translates.findIndex(x => x.lang_key.lang_key == "es" && x.key_id == key_id);
    if (translationIdx === -1) {
      if(this.loadedTranslates && this.advisedNotFoundTranslates.findIndex(x => x == key_id) === -1) {
        console.error("CUSTOM TRANSLATION ERROR: " + key_id + " - {NOT_FOUND}");
        this.advisedNotFoundTranslates.push(key_id);
      }
      return "";
    }
    else {
      return this.translates[translationIdx].value;
    }
  }

  pipeLangTranslate(key_id: string, langKey: string) {
    let translationIdx = this.translates.findIndex(x => x.lang_key.lang_key == langKey && x.key_id == key_id);
    if (translationIdx === -1) {
      return false;
    }
    else {
      return this.translates[translationIdx].value;
    }
  }

  getTranslate(key_id: string, langKey: string) {
    const pipeTranslate = this.pipeLangTranslate(key_id, langKey);
    if (pipeTranslate) {
      return pipeTranslate;
    }
    else {
      const defaultTranslate = this.defaultLangTranslate(key_id);
      return defaultTranslate;
    }
  }

  retTranslates() {
    this.api.get('rest/session/translates')
      .subscribe(
        (customTranslates: Array<CustomTranslate>) => {
          this.translates = customTranslates;
          this.loadedTranslates = true;
        },
        (err) => {
          console.error("COULD NOT LOAD CUSTOM TRANSLATES: ", err);
          this.loadedTranslates = true;
        });
  }

}
