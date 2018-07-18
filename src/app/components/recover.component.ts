import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {NotificationsService} from 'angular2-notifications';
import {AuthToken} from '../kernel/model/auth-token';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../kernel/services/api.service';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {finalize} from "rxjs/operators";
@Component({
    selector: 'main-content',
    templateUrl: '../templates/recover.component.html'
})

export class RecoverComponent {
    public dni: string;
    public isPropietary: boolean = false;

    constructor(private router: Router,
        private api: ApiService,
        private loadingBar: LoadingBarService,
        private notify: NotificationsService,
        private translate: TranslateService) {}
    recoverAccountForm(): void {
        this.loadingBar.start();
        if (this.isPropietary) {
            this.api.post("recover", {dni: this.dni})
                .pipe(finalize(() => {
                    this.loadingBar.complete();
                }))
                .subscribe(
                    (response: HttpResponse<AuthToken>) => {
                        this.notify.success(
                            this.translate.get("notifications")["value"]["recover"]["success"]["title"],
                            this.translate.get("notifications")["value"]["recover"]["success"]["desc"]
                        );
                        this.router.navigate(['recover/code']);
                    },
                    (error: HttpErrorResponse) => {
                        if (error.status === 416) {
                            this.notify.info(
                                this.translate.get("notifications")["value"]["recover"]["info_boss"]["title"],
                                this.translate.get("notifications")["value"]["recover"]["info_boss"]["desc"]
                            );
                        }
                        else {
                            this.notify.error(
                                this.translate.get("notifications")["value"]["recover"]["error"]["title"],
                                this.translate.get("notifications")["value"]["recover"]["error"]["desc"]
                            );
                        }
                    });
        }
        else {
            this.notify.error(
                this.translate.get("notifications")["value"]["recover"]["error_propietary"]["title"],
                this.translate.get("notifications")["value"]["recover"]["error_propietary"]["desc"]
            );
        }
    }
}
