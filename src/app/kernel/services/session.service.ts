import {Injectable} from '@angular/core';
import {ApiOptions} from "../config/api.config";
import {AuthToken} from "../model/auth-token";
import {ToastrService} from "ngx-toastr";

export var chargingToken = false;

@Injectable()
export class SessionService {

  constructor(private toastr: ToastrService) {

  }
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
    /* fir for modal's when disconnecting, that keeped the overlay */
  }
}
