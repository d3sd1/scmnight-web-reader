import {AfterViewChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import {NotificationOptions} from '../kernel/config/notifications.config';
import {PreloaderService} from '../kernel/services/preloader.service';
import {SessionSingleton} from "../kernel/singletons/session.singleton";
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "../kernel/services/auth.service";

@Component({
  selector: 'app-root',
  template: '<ngx-loading-bar></ngx-loading-bar><simple-notifications [options]="options"></simple-notifications><router-outlet></router-outlet>'
})
export class BoostrapComponent implements AfterViewInit, OnInit {
  public options = NotificationOptions;

  constructor(private preloader: PreloaderService, private sessionInfo: SessionSingleton, private translate: TranslateService, private authService: AuthService) {
  }

  ngOnInit() {
    this.translate.get('preloader.loading').subscribe((res: string) => {
      this.preloader.changeText(res);
    });
  }

  ngAfterViewInit() {
    if (this.authService.loggedIn()) {
      let loadedUser = false,
        loadedPermissions = false;

      this.translate.get('preloader.loadinguser').subscribe((res: string) => {
        this.preloader.changeText(res);
      });
      this.sessionInfo.getUser().then(res => {

        this.translate.get('preloader.userloaded').subscribe((res: string) => {
          this.preloader.changeText(res);
        });
        loadedUser = true;
        if (loadedUser && loadedPermissions) {
          this.preloader.stop();
        }
      });
      this.sessionInfo.getPermissions().then(res => {
        this.translate.get('preloader.userloaded').subscribe((res: string) => {
          this.preloader.changeText(res);
        });
        loadedPermissions = true;
        if (loadedUser && loadedPermissions) {
          this.preloader.stop();
        }
      });
    }
    else {
      this.preloader.stop();
    }
  }
}
