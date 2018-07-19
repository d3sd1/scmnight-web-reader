import {Injectable} from '@angular/core';
import {Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {CanActivate} from '@angular/router';
import {WsAuthService} from '../services/ws-auth.service';
import {SessionSingleton} from '../singletons/session.singleton';
import {MenuOptionData} from '../model/menu-option-data';
import {Permission} from "../model/Permission";

@Injectable()
export class RanksService implements CanActivate {

  constructor(private router: Router, private sessionInfo: SessionSingleton) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.sessionInfo.getUser().then(loadedUser => {
      return this.sessionInfo.getPermissions().then(userPermissions => {
        const data = route.data as MenuOptionData;
        let user = loadedUser;
        if (typeof data.requiredPermission == "undefined") {
          console.warn("permisos no configurados para ruta ", route.data);
          return true;
        }
        return userPermissions !== null && typeof userPermissions.find(x => x.action === data.requiredPermission) !== "undefined";
      });

    });
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.canActivate(route, state);
  }
}
