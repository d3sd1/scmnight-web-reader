import {Injectable} from '@angular/core';
import * as $ from "jquery";
import {ApiOptions} from "../config/api.config";
import {AuthToken} from "../model/auth-token";

export var chargingToken = false;

@Injectable()
export class SessionService {

  //TOD: que si se esta enviando el token se espere el get token :)
  getToken() {
    return localStorage.getItem(ApiOptions.tokenParameter);
  }

  getTokenId() {
    return localStorage.getItem(ApiOptions.idParameter)
  }

  setToken(authToken: AuthToken) {
    chargingToken = true;
    localStorage.setItem(ApiOptions.tokenParameter, authToken.value);
    chargingToken = false;
  }

  setTokenId(authToken: AuthToken) {
    localStorage.setItem(ApiOptions.idParameter, authToken.id.toString());
  }

  delToken() {
    localStorage.clear();
  }
}
