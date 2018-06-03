/* Angular */
import {Routes} from '@angular/router';

/* Components */
import {LoginComponent} from '../../components/login.component';
import {NavbarComponent} from '../../components/navbar.component';
import {ErrorComponent} from '../../components/error.component';
import {RecoverComponent} from '../../components/recover.component';
import {RecoverCodeComponent} from '../../components/recover.code.component';
import {MenuRoutes} from '../../kernel/config/routes.menu.config';

/* Services */
import {LoggedInService} from '../services/logged-in.service';
import {RanksService} from '../services/ranks.service';
import {LoggedOutService} from '../services/logged-out.service';

export const FullRoutes: Routes = [
    {
        path: "",
        redirectTo: 'login',
        pathMatch: 'full',
        data: {
            showOnMenu: false
        }
    },
    {
        path: 'dashboard',
        component: NavbarComponent,
        canActivateChild: [LoggedInService, RanksService],
        children: MenuRoutes
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoggedOutService]
    },
    {
        path: 'recover',
        component: RecoverComponent,
        canActivate: [LoggedOutService]
    },
    {
        path: 'recover/code',
        component: RecoverCodeComponent,
        canActivate: [LoggedOutService]
    },
    {
        path: 'error/:code',
        component: ErrorComponent
    },
    {
        path: '**',
        redirectTo: 'error/404'
    }
];