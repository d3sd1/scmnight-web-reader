import {Routes} from '@angular/router';

/* Components */
import {DashboardComponent} from '../../components/dashboard.component';
import {ProfileComponent} from '../../components/profile.component';
import {UsersManageComponent} from '../../components/users/users.manage.component';
import {LogoutComponent} from '../../components/logout.component';
import {ClientsRoomComponent} from '../../components/clients/clients.room.component';
import {ClientsTotalComponent} from '../../components/clients/clients.total.component';
import {UsersTotalComponent} from '../../components/users/users.total.component';
import {UsersRoomComponent} from '../../components/users/users.room.component';
import {ConfigComponent} from '../../components/config.component';

/* Services */
import {LoggedInService} from '../services/logged-in.service';

export const MenuRoutes: Routes = [
    {
        path: '',
        redirectTo: 'start',
        pathMatch: 'full',
        data: {
            validRanks: [5, 4, 3, 2, 1],
            hidden: true
        }
    },
    {
        path: 'user',
        data: {
            icon: "account",
            validRanks: [5, 4, 3, 2, 1],
            isProfileText: true
        },
        children: [
            {
                path: 'profile',
                component: ProfileComponent,
                data: {
                    validRanks: [5, 4, 3, 2, 1]
                },
            },
            {
                path: 'logout',
                component: LogoutComponent,
                canActivate: [LoggedInService],
                data: {
                    validRanks: [5, 4, 3, 2, 1]
                },
            }
        ]
    },
    {
        path: 'start',
        component: DashboardComponent,
        data: {
            icon: "home",
            validRanks: [5, 4, 3, 2, 1]
        },
    },
    {
        path: 'users',
        data: {
            icon: "account-multiple",
            validRanks: [5, 4, 3, 2, 1]
        },
        children: [
            {
                path: 'manage',
                component: UsersManageComponent,
                data: {
                    validRanks: [5, 4, 3, 2, 1]
                },
            },
            {
                path: 'room',
                component: UsersRoomComponent,
                data: {
                    validRanks: [5, 4, 3, 2, 1]
                },
            },
            {
                path: 'all',
                component: UsersTotalComponent,
                data: {
                    validRanks: [5, 4, 3, 2, 1]
                },
            }
        ]
    },
    {
        path: 'room',
        data: {
            icon: "camera-front",
            validRanks: [5, 4, 3]
        },
        children: [
            {
                path: 'bar',
                component: UsersManageComponent,
                data: {
                    validRanks: [5, 4, 3]
                }
            },
            {
                path: 'stage',
                component: UsersManageComponent,
                data: {
                    validRanks: [5, 4, 3]
                }
            },
            {
                path: 'reserved',
                component: UsersManageComponent,
                data: {
                    validRanks: [5, 4, 3]
                }
            }
        ]
    },
    {
        path: 'clients',
        data: {
            icon: "human-male-female",
            validRanks: [5, 4],
            hidden: false
        },
        children: [
            {
                path: 'room',
                component: ClientsRoomComponent,
                data: {
                    validRanks: [5, 4]
                }
            },
            {
                path: 'all',
                component: ClientsTotalComponent,
                data: {
                    validRanks: [5, 4]
                }
            }
        ]
    },

    {
        path: 'monetization',
        component: UsersManageComponent,
        data: {
            icon: "currency-usd",
            validRanks: [5, 4, 3]
        }
    },
    {
        path: 'stock',
        component: UsersManageComponent,
        data: {
            icon: "food-fork-drink",
            validRanks: [5, 4, 3]
        }
    },
    {
        path: 'stats',
        component: UsersManageComponent,
        data: {
            icon: "chart-areaspline",
            validRanks: [5, 4, 3]
        }
    },
    {
        path: 'marketing',
        data: {
            icon: "chart-line",
            validRanks: [5, 4, 3]
        },
        children: [
            {
                path: 'promos',
                component: UsersManageComponent,
                data: {
                    validRanks: [5, 4, 3]
                }
            },
            {
                path: 'events',
                component: UsersManageComponent,
                data: {
                    validRanks: [5, 4, 3]
                }
            },
            {
                path: 'parties',
                component: UsersManageComponent,
                data: {
                    validRanks: [5, 4, 3]
                }
            }
        ]
    },
    {
        path: 'config',
        component: ConfigComponent,
        data: {
            icon: "settings",
            validRanks: [5]
        }
    }
];