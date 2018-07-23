import {Injectable} from '@angular/core';
import {WsService} from '../../kernel/services/ws.service';
import {TranslateService} from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router';
import {SessionService} from "./session.service";

@Injectable()
export class WsAuthService {
  constructor(private toastr: ToastrService, private translate: TranslateService, private ws: WsService, private router: Router, private sessMan: SessionService) {
  }

  loggedInGuard() {
    this.ws.subscribe("scm/auth", this.loginSocketCallback.bind(this));
  }

  loggedOutGuard() {
    this.ws.unsubscribe("scm/auth");
  }

  private loginSocketCallback(uri: any, data: any) {
    let parsedData = JSON.parse(data),
      logoutUsers = parsedData["logoutUsers"],
      myToken = this.sessMan.getToken();
    logoutUsers.forEach((logoutToken) => {
      if (logoutToken["token"] === myToken) {
        this.sessMan.delToken();
        this.router.navigate(['error/406']);
        this.translate.get("notifications.CONNECTED_OTHERWHERE").subscribe((res: string) => {
          this.toastr.warning(
            "",
            res
          );
        });
      }
    });
  }
}
