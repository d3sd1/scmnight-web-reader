import {NgModule} from '@angular/core';
import {JwtModule} from '@auth0/angular-jwt'
import {environment} from '../../../environments/environment';
import {ApiOptions} from '../config/api.config';

@NgModule({
    imports: [
        JwtModule.forRoot({
            config: {
                headerName: ApiOptions.headerName,
                authScheme: ApiOptions.authScheme,
                throwNoTokenError: false,
                tokenGetter: function getToken() {
                  return null;
                },
                whitelistedDomains: [environment.baseUrl]
            },

        })
    ]
})

export class AuthModule {}
