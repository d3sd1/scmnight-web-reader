import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {ApiService} from '../kernel/services/api.service';
import {ApiOptions} from '../kernel/config/api.config';
import {AuthService} from '../kernel/services/auth.service';
import {finalize} from "rxjs/operators";
import {SessionService} from "../kernel/services/session.service";

@Component({
  selector: 'main-content',
  template: ''
})

export class LogoutComponent implements OnInit {

  constructor(private router: Router,
              private api: ApiService,
              private authService: AuthService,
              private loadingBar: LoadingBarService,
              private sessMan: SessionService) {
  }

  ngOnInit(): void {
    if (this.authService.loggedIn()) {
      this.loadingBar.start();
      this.api.del("rest/auth/logout" + '/' + this.sessMan.getTokenId())
        .pipe(finalize(() => {
          this.sessMan.delToken();
          this.router.navigate(['login']);
          this.loadingBar.complete();
        }))
        .subscribe();
    }
    else {
      this.router.navigate(['login']);
    }
  }
}
