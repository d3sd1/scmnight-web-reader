import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import {Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent} from 'rxjs';
import {deserialize} from 'json-typescript-mapper';
import {ResponseMessage} from '../model/response-message';
import {map, filter, catchError, mergeMap} from 'rxjs/operators';
import {throwError} from "rxjs/internal/observable/throwError";

@Injectable()
export class ApiNotifierInterceptor implements HttpInterceptor {
  constructor(private router: Router,
              private toastr: ToastrService,
              private translate: TranslateService) {

  }

  private sendNotification(response: ResponseMessage) {
    if (response.message !== null && typeof response.message != "undefined" && response.message !== "") {
      this.translate.get("api_notifications." + response.message).subscribe((translation: string) => {
        if (response.code > 0 && response.code <= 100) {
          this.toastr.show(
            "",
            translation
          );
        }
        else if (response.code >= 100 && response.code < 200) {
          this.toastr.info(
            "",
            translation
          );
        }
        else if (response.code >= 200 && response.code < 300) {
          this.toastr.success(
            "",
            translation
          );
        }
        else if (response.code > 300 && response.code < 400) {
          this.toastr.show(
            "",
            translation
          );
        }
        else if (response.code >= 400 && response.code < 500 && response.code != 401 && response.code != 406) {
          this.toastr.show(
            "",
            translation
          );
        }
        else if (response.code > 500 && response.code != 500) {
          this.toastr.error(
            "",
            translation
          );
        }
      });
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
          let response: ResponseMessage = deserialize(ResponseMessage, err.error);
          if(typeof response !== "undefined" && "code" in response){
            response.code = err.status;
            this.sendNotification(response);
          }
          return throwError(err);
        }
      }))
  }
}
