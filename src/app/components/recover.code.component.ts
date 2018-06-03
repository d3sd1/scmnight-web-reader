import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {NotificationsService} from 'angular2-notifications';
import {AuthToken} from '../kernel/model/auth-token';
import {TranslateService} from '@ngx-translate/core';
import {ApiOptions} from '../kernel/config/api.config';
import {ApiService} from '../kernel/services/api.service';
import 'rxjs/add/operator/finally';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
@Component({
    selector: 'main-content',
    templateUrl: '../templates/recover.code.component.html'
})

export class RecoverCodeComponent {
    public code: string;

    constructor(private router: Router,
        private api: ApiService,
        private loadingBar: LoadingBarService,
        private notify: NotificationsService,
        private translate: TranslateService) {}
    finalRecoverAccount(): void {
        this.loadingBar.start();

        this.api.post("recover/code", {code: this.code})
            .finally(() => {
                this.loadingBar.complete();
            })
            .subscribe(
                (response: HttpResponse<AuthToken>) => {
                    this.notify.success(
                        this.translate.get("notifications")["value"]["recover_code"]["success"]["title"],
                        this.translate.get("notifications")["value"]["recover_code"]["success"]["desc"]
                    );
                    this.router.navigate(['login']);
                },
                (error: HttpErrorResponse) => {
                    if (error.status === 408) {
                        this.notify.info(
                            this.translate.get("notifications")["value"]["recover"]["error_expired"]["title"],
                            this.translate.get("notifications")["value"]["recover"]["error_expired"]["desc"]
                        );
                        this.router.navigate(['recover']);
                    }
                    else {
                        this.notify.error(
                            this.translate.get("notifications")["value"]["recover"]["error"]["title"],
                            this.translate.get("notifications")["value"]["recover"]["error"]["desc"]
                        );
                    }
                });
    }
}