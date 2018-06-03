import {Injectable} from '@angular/core';
import {Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {CanActivate} from '@angular/router';
import {WsAuthService} from '../services/ws-auth.service';
import {SessionSingleton} from '../singletons/session.singleton';
import {MenuOptionData} from '../model/menu-option-data';

@Injectable()
export class RanksService implements CanActivate {

    constructor(private router: Router, private sessionInfo: SessionSingleton) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.sessionInfo.getUser().then(user => {
            const data = route.data as MenuOptionData;
            if (data.validRanks.find(x => x === user.rank))
            {
                return true;
            }
            else
            {
                if(user.rank !== null)
                {
                    this.router.navigate(['error/401']);
                }
                return false;
            }
        });
    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.canActivate(route,state);
    }
}