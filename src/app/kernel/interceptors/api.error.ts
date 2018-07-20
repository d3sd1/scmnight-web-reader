import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';
import {TranslateService} from '@ngx-translate/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import {Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent} from 'rxjs';
import {map, filter, catchError, mergeMap} from 'rxjs/operators';
import {throwError} from "rxjs/internal/observable/throwError";
import {SessionService} from "../services/session.service";

@Injectable()
export class ApiErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router,
              private notify: NotificationsService,
              private translate: TranslateService,
              private sessMan: SessionService) {

  }

  intercept(request
              :
              HttpRequest<any>, next
              :
              HttpHandler
  ):
    Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(catchError((err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          /* Client error */
        } else {
          /* Server Error */
          if (err.status === 0 && this.router.url != "/error/000") {
            this.router.navigate(['error/000']);
          }
          else if (err.status === 401 && this.router.url != "/dashboard/logout" && this.router.url != "/login") {
            this.translate.get('notifications.SESSION_EXPIRED').subscribe((res: string) => {
              this.router.navigate(['error/401']);
              this.sessMan.delToken();
              this.notify.info(
                "",
                res
              );
            });
          }
          else if (err.status === 406 && this.router.url != "/error/406") {
            this.sessMan.delToken();
            this.router.navigate(['error/406']);
            this.notify.warn(
              "",
              this.translate.get("notifications.CONNECTED_OTHERWHERE")["value"]
            );
          }
          else if (err.status === 500 && this.router.url != "/error/500") {
            this.sessMan.delToken();
            this.router.navigate(['error/500']);
            this.notify.warn(
              "",
              this.translate.get("notifications.SERVER_ERROR")["value"]
            );
          }
        }
        return throwError(err);
      }));
  }
}
