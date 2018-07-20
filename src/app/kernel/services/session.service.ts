import {Injectable} from '@angular/core';
import * as $ from "jquery";
import {ApiOptions} from "../config/api.config";
import {AuthToken} from "../model/auth-token";
@Injectable()
export class SessionService {

  //TOD: que si se esta enviando el token se espere el get token :)
  getToken() {
    console.log("GET token");
    return localStorage.getItem(ApiOptions.tokenParameter);
  }
  getTokenId() {
    console.log("GET token ID");
    return localStorage.getItem(ApiOptions.idParameter)
  }
  setToken(authToken: AuthToken) {
    console.log("set token");
    localStorage.setItem(ApiOptions.tokenParameter, authToken.value);
  }
  setTokenId(authToken: AuthToken) {

    console.log("set token id");
    localStorage.setItem(ApiOptions.idParameter, authToken.id.toString());
  }
  delToken() {
    localStorage.clear();
  }
}
