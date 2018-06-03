import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {NotificationsService} from 'angular2-notifications';
import {AuthToken} from '../kernel/model/auth-token';
import {User} from '../kernel/model/user';
import {TranslateService} from '@ngx-translate/core';
import {ApiOptions} from '../kernel/config/api.config';
import {ApiService} from '../kernel/services/api.service';
import 'rxjs/add/operator/finally';
@Component({
    selector: 'main-content',
    templateUrl: '../templates/login.component.html'
})

export class LoginComponent implements OnInit {
    public coords = {lat: 0, lng: 0};
    public user:User = new User();
    public extendedSession:boolean = false;

    constructor(private router: Router,
        private api: ApiService,
        private loadingBar: LoadingBarService,
        private notify: NotificationsService,
        private translate: TranslateService) {}
    submitSignInForm(): void {
        this.loadingBar.start();

        this.api.post("auth-login", {user: this.user, coords: this.coords, extendedSession: this.extendedSession})
            .finally(() => {
                this.loadingBar.complete();
            })
            .subscribe(
            (authToken: AuthToken) => {
                console.log("LOGN",authToken);
                localStorage.setItem(ApiOptions.idParameter, authToken.id.toString());
                localStorage.setItem(ApiOptions.tokenParameter, authToken.value);
                this.notify.success(
                    this.translate.get("notifications")["value"]["login"]["success"]["title"],
                    this.translate.get("notifications")["value"]["login"]["success"]["desc"]
                );
                this.router.navigate(['dashboard']);
            },
            (error: object) => {
                this.notify.error(
                    this.translate.get("notifications")["value"]["login"]["error_password"]["title"],
                    this.translate.get("notifications")["value"]["login"]["error_password"]["desc"]
                );
            }
            );
    }
    ngOnInit() {
        this.getLocation();
    }
    private getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.initPosition.bind(this), this.errorPosition.bind(this), {
                enableHighAccuracy: true,
                maximumAge: 30000,
                timeout: 27000
            });
        } else {
            this.notify.warn(
                this.translate.get("notifications")["value"]["geolocation"]["error_notsupported"]["title"],
                this.translate.get("notifications")["value"]["geolocation"]["error_notsupported"]["desc"]
            );
        }
    }
    private initPosition(position) {
        this.coords.lat = position.coords.latitude;
        this.coords.lng = position.coords.longitude;
    }
    private errorPosition() {
        this.notify.warn(
            this.translate.get("notifications")["value"]["geolocation"]["error_denied"]["title"],
            this.translate.get("notifications")["value"]["geolocation"]["error_denied"]["desc"]
        );
    }
}