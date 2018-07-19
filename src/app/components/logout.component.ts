import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {TranslateService} from '@ngx-translate/core';
import {NotificationsService} from 'angular2-notifications';
import {ApiService} from '../kernel/services/api.service';
import {ApiOptions} from '../kernel/config/api.config';
import {AuthService} from '../kernel/services/auth.service';
import {finalize} from "rxjs/operators";

@Component({
    selector: 'main-content',
    template: ''
})

export class LogoutComponent implements OnInit {

    constructor(private router: Router,
        private translate: TranslateService,
        private notify: NotificationsService,
        private api: ApiService,
        private authService: AuthService,
        private loadingBar: LoadingBarService) {}

    ngOnInit(): void {
        if (this.authService.loggedIn()) {
            this.loadingBar.start();
            this.api.del("rest/auth/logout" + '/' + localStorage.getItem(ApiOptions.idParameter))
                .pipe(finalize(() => {
                    localStorage.clear();

                    this.router.navigate(['login']);
                    this.loadingBar.complete();
                }))
                .subscribe(
                () => this.notify.success(
                    this.translate.get("notifications")["value"]["logout"]["success"]["title"],
                    this.translate.get("notifications")["value"]["logout"]["success"]["desc"]
                ));
        }
        else {
            this.router.navigate(['login']);
        }
    }
}
