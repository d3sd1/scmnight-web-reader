import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {CanActivate} from '@angular/router';
import {AuthService} from './auth.service';
import {WsAuthService} from '../services/ws-auth.service';

@Injectable()
export class LoggedOutService implements CanActivate {

    constructor(private authService: AuthService, private router: Router, private wsAuth:WsAuthService) {}

    canActivate() {
        if (!!sessionStorage.getItem("authConnected")) {
            this.wsAuth.loggedOutGuard();
        }
        if (!this.authService.loggedIn()) {
            return true;
        } else {
            this.router.navigate(['dashboard/start']);
            return false;
        }
    }
}