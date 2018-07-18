import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';
import {TranslateService} from '@ngx-translate/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import {deserialize} from 'json-typescript-mapper';
import {ResponseMessage} from '../model/response-message';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import {throwError} from "rxjs/internal/observable/throwError";

@Injectable()
export class ApiNotifierInterceptor implements HttpInterceptor {
  constructor(private router: Router,
              private notify: NotificationsService,
              private translate: TranslateService) {

  }

  private sendNotification(response: ResponseMessage) {
    if (response.message !== null && typeof response.message != "undefined" && response.message !== "") {
      console.log(response);
      let translation = this.translate.get("api_notifications." + response.message)["value"];
      if (response.code > 0 && response.code <= 100) {
        this.notify.alert(
          "",
          translation
        );
      }
      else if (response.code >= 100 && response.code < 200) {
        this.notify.info(
          "",
          translation
        );
      }
      else if (response.code >= 200 && response.code < 300) {
        this.notify.success(
          "",
          translation
        );
      }
      else if (response.code > 300 && response.code < 400) {
        this.notify.alert(
          "",
          translation
        );
      }
      else if (response.code >= 400 && response.code < 500) {
        this.notify.warn(
          "",
          translation
        );
      }
      else if (response.code > 500) {
        this.notify.error(
          "",
          translation
        );
      }
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          let response: ResponseMessage = deserialize(ResponseMessage, event.body);
          response.code = event.status;
          if (typeof response.data != "undefined" || typeof response.message != "undefined") {
            this.sendNotification(response);
            return event.clone({
              body: event.body.data
            });
            ;
          }
        }
        return event;
      }), catchError((err: any, caught) => {
        if (err instanceof HttpErrorResponse) {
          console.log(err);
          let response: ResponseMessage = deserialize(ResponseMessage, err.error);
          response.code = err.status;
          this.sendNotification(response);
          return throwError(err);
        }
      }))
  }
}
