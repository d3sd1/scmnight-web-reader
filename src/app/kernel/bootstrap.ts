/* Angular */
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {OnInit} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {ToastContainerModule, ToastrModule} from 'ngx-toastr';

/* Modules */
import {LoadingBarRouterModule} from '@ngx-loading-bar/router';
import {RoutingModule} from './modules/routing.module';
import {AuthModule} from './modules/auth.module';
import {LoggedOutModule} from './modules/logged-out.module';
import {LoggedInModule} from './modules/logged-in.module';
import {LanguageModule} from './modules/language.module';
import {BoostrapComponent} from '../components/bootstrap.component';

/* Services */
import {LoggedInService} from './services/logged-in.service';
import {LoggedOutService} from './services/logged-out.service';
import {AuthService} from './services/auth.service';
import {ApiService} from './services/api.service';
import {WS, WsService} from './services/ws.service';
import {WsAuthService} from './services/ws-auth.service';
import {RanksService} from './services/ranks.service';
import {PreloaderService} from './services/preloader.service';
import {environment} from '../../environments/environment';
import {wsInitializerProvider} from './libs/ws.lib';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ApiErrorInterceptor} from './interceptors/api.error';
import {ApiNotifierInterceptor} from './interceptors/api.notifier';
import {ErrorComponent} from '../components/error.component';
import {SessionService} from "./services/session.service";
import {ToastrConfig} from "./config/toastr.config";


@NgModule({
  imports: [
    RoutingModule,
    HttpClientModule,
    LoadingBarRouterModule,
    LoggedOutModule,
    LoggedInModule,
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(ToastrConfig),
    ToastContainerModule,
    LanguageModule,
    AuthModule
  ],
  declarations: [
    BoostrapComponent,
    ErrorComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiNotifierInterceptor,
      multi: true,
    },
    AuthService,
    LoggedInService,
    LoggedOutService,
    ApiService,
    PreloaderService,
    wsInitializerProvider,
    WsService,
    WS,
    RanksService,
    WsAuthService
  ],
  bootstrap: [
    BoostrapComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class Bootstrap implements OnInit {
  constructor(private sessMan: SessionService) {

  }

  ngOnInit() {
    if (environment.production) {
      this.sessMan.delToken();
    }
  }
}
