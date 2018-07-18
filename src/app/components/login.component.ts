import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {NotificationsService} from 'angular2-notifications';
import {AuthToken} from '../kernel/model/auth-token';
import {User} from '../kernel/model/user';
import {TranslateService} from '@ngx-translate/core';
import {ApiOptions} from '../kernel/config/api.config';
import {ApiService} from '../kernel/services/api.service';
import {finalize} from "rxjs/operators";
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

      this.api.post("rest/auth-login", {user: this.user, coords: this.coords, extendedSession: this.extendedSession})
            .pipe(finalize(() => {
                this.loadingBar.complete();
            }))
            .subscribe(
            (authToken: AuthToken) => {
                localStorage.setItem(ApiOptions.idParameter, authToken.id.toString());
                localStorage.setItem(ApiOptions.tokenParameter, authToken.value);
                this.router.navigate(['dashboard']);
            });
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
              "",
              this.translate.get("notifications.GEOLOCATION_UNSUPPORTED")["value"]
            );
        }
    }
    private initPosition(position) {
        this.coords.lat = position.coords.latitude;
        this.coords.lng = position.coords.longitude;
    }
    private errorPosition() {
        this.notify.warn(
          "",
          this.translate.get("notifications.GEOLOCATION_DENIED")["value"]
        );
    }
}
