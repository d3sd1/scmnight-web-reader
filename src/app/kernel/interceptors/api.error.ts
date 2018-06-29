import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';
import {TranslateService} from '@ngx-translate/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/retry';

@Injectable()
export class ApiErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router,
              private notify: NotificationsService,
              private translate: TranslateService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .catch((err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          /* Client error */
        } else {
          /* Server Error */
          if (err.status === 0 && this.router.url != "/error/000") {
            this.router.navigate(['error/000']);
          }
          else if (err.status === 401 && this.router.url != "/dashboard/logout") {
            this.router.navigate(['logout']);
            this.notify.info(
              "",
              this.translate.get("notifications.SESSION_EXPIRED")["value"]
            );
          }
          else if (err.status === 406 && this.router.url != "/error/406") {
            localStorage.clear();
            this.router.navigate(['error/406']);
            this.notify.warn(
              "",
              this.translate.get("notifications.CONNECTED_OTHERWHERE")["value"]
            );
          }
          else if (err.status === 500 && this.router.url != "/error/500") {
            localStorage.clear();
            this.router.navigate(['error/500']);
            this.notify.warn(
              "",
              this.translate.get("notifications.SERVER_ERROR")["value"]
            );
          }
        }
        return Observable.throw(err);
      });
  }
}
