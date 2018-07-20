import {NgModule} from '@angular/core';
import {JwtModule} from '@auth0/angular-jwt'
import {environment} from '../../../environments/environment';
import {ApiOptions} from '../config/api.config';
import {chargingToken} from "../services/session.service";

@NgModule({
  imports: [
    JwtModule.forRoot({
      config: {
        headerName: ApiOptions.headerName,
        authScheme: ApiOptions.authScheme,
        throwNoTokenError: false,
        tokenGetter: getToken,
        whitelistedDomains: [environment.baseUrl]
      },

    })
  ]
})

export class AuthModule {
}

export function getToken() {
  if (chargingToken) {
    setTimeout(getToken, 500);
  }
  else {
    return localStorage.getItem(ApiOptions.tokenParameter);
  }
}
