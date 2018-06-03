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
import {deserialize} from 'json-typescript-mapper';
import {ResponseMessage} from '../model/response-message';

@Injectable()
export class ApiNotifierInterceptor implements HttpInterceptor {
    constructor(private router: Router,
        private notify: NotificationsService,
        private translate: TranslateService) {

    }
    private sendNotification(response: ResponseMessage) {
        if (response.message !== null && typeof response.message != "undefined" && response.message !== "") {
            let translation = this.translate.get("api_notifications." + response.message + ".desc")["value"];
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
            .map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    let response: ResponseMessage = deserialize(ResponseMessage, event.body);
                    console.log("RESP", response);
                    if (typeof response.code != "undefined" || typeof response.message != "undefined" || typeof response.data != "undefined") {
                        console.log("ENTRO");
                        //AQUI NO RETORNA BIEN, ES DECIR, SE CORTA EL FLUJO Y NO ENVIA LOS DATOS AL LOGIN. ES EL UNICO ERROR
                        this.sendNotification(response);
                        return response.data;
                    }
                }
                return event;
            })
            .catch((err: any, caught) => {
                if (err instanceof HttpErrorResponse) {
                    let response: ResponseMessage = deserialize(ResponseMessage, err.error);
                    this.sendNotification(response);
                    return Observable.throw(err);
                }
            });
        /*.catch((err: HttpErrorResponse) => {
            /*
             * 200 - Petición correcta
    RECOVER_EMAIL_SENT
    RECOVER_ACCOUNT_SUCCESS
	
400 - Formularios y datos del usuario
    NO_USER_PROVIDED
    NO_RECOVER_FOUND
    RECOVER_CODE_EXPIRED
    NO_CONFIG_FOUND
    INCORRECT_USER
	
401 - Cabeceras API
    INVALID_TOKEN
    EXPIRED_TOKEN
    AUTH_HEADER_REQUIRED
	
403 - Permisos
    USER_HAS_NO_PERMISSIONS
	
406 - Conectado desde otro dispositivo
    CONNECTED_OTHER_PC
	
500 - Error de servidor
    REST_PERMISSIONS_CHECK
    REST_PERMISSIONS_NOT_CONFIGURED
    USER_PERMISSIONS_NOT_CONFIGURED
    REST_PERMISSIONS_NOT_CONFIGURED
    USER_PERMISSIONS_INMUTABLE
    EMAIL_SEND_ERROR
            
            if (err.error instanceof Error) {
                /* Client error 
            } else {
                /* Server Error 
                if (err.status === 0 && this.router.url != "/error/000") {
                    this.router.navigate(['error/000']);
                }
                else if (err.status === 401 && this.router.url != "/dashboard/logout") {
                    this.router.navigate(['logout']);
                    this.notify.info(
                        this.translate.get("notifications")["value"]["logout"]["error_session_expired"]["title"],
                        this.translate.get("notifications")["value"]["logout"]["error_session_expired"]["desc"]
                    );
                }
                if (err.status === 406 && this.router.url != "/error/406") {
                    localStorage.clear();
                    this.router.navigate(['error/406']);
                    
                }
            }
            return Observable.throw(err);
        }); */
    }
}