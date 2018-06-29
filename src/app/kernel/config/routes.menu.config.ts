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
import {ClientsConflictiveComponent} from "../../components/clients/clients.conflictive.component";

export const MenuRoutes: Routes = [
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full',
    data: {
      hidden: true
    }
  },
  {
    path: 'user',
    data: {
      icon: "account",
      isProfileText: true
    },
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          requiredPermission: "MANAGE_PROFILE"
        },
      },
      {
        path: 'logout',
        component: LogoutComponent,
        canActivate: [LoggedInService],
        data: {
          requiredPermission: "LOGOUT"
        },
      }
    ]
  },
  {
    path: 'start',
    component: DashboardComponent,
    data: {
      icon: "home",
      requiredPermission: "VIEW_DASHBOARD"
    },
  },
  {
    path: 'users',
    data: {
      icon: "account-multiple"
    },
    children: [
      {
        path: 'manage',
        component: UsersManageComponent,
        data: {
          requiredPermission: "MANAGE_USERS"
        },
      },
      {
        path: 'room',
        component: UsersRoomComponent,
        data: {
          requiredPermission: "VIEW_ROOM_USERS"
        },
      },
      {
        path: 'all',
        component: UsersTotalComponent,
        data: {
          requiredPermission: "VIEW_ALL_USERS"
        },
      }
    ]
  },
  {
    path: 'room',
    data: {
      icon: "camera-front",
    },
    children: [
      {
        path: 'bar',
        component: UsersManageComponent,
        data: {
          requiredPermission: "MANAGE_ROOM_BAR"
        }
      },
      {
        path: 'stage',
        component: UsersManageComponent,
        data: {
          requiredPermission: "MANAGE_ROOM_STAGE"
        }
      },
      {
        path: 'reserved',
        component: UsersManageComponent,
        data: {
          requiredPermission: "MANAGE_ROOM_RESERVED"
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
        path: 'conflictive',
        component: ClientsConflictiveComponent,
        data: {
          requiredPermission: "SET_USER_CONFLICTIVE"
        }
      },
      {
        path: 'room',
        component: ClientsRoomComponent,
        data: {
          requiredPermission: "VIEW_ROOM_CLIENTS"
        }
      },
      {
        path: 'all',
        component: ClientsTotalComponent,
        data: {
          requiredPermission: "VIEW_ALL_CLIENTS"
        }
      }
    ]
  },

  {
    path: 'monetization',
    component: UsersManageComponent,
    data: {
      icon: "currency-usd",
      requiredPermission: "VIEW_MONETIZATION"
    }
  },
  {
    path: 'stock',
    component: UsersManageComponent,
    data: {
      icon: "food-fork-drink",
      requiredPermission: "MANAGE_STOCK"
    }
  },
  {
    path: 'stats',
    component: UsersManageComponent,
    data: {
      icon: "chart-areaspline",
      requiredPermission: "VIEW_STATS"
    }
  },
  {
    path: 'marketing',
    data: {
      icon: "chart-line",
    },
    children: [
      {
        path: 'promos',
        component: UsersManageComponent,
        data: {
          requiredPermission: "MANAGE_MARKETING_PROMOS"
        }
      },
      {
        path: 'events',
        component: UsersManageComponent,
        data: {
          requiredPermission: "MANAGE_MARKETING_EVENTS"
        }
      },
      {
        path: 'parties',
        component: UsersManageComponent,
        data: {
          requiredPermission: "MANAGE_MARKETING_PARTIES"
        }
      }
    ]
  },
  {
    path: 'config',
    component: ConfigComponent,
    data: {
      icon: "settings",
      requiredPermission: "MANAGE_CONFIG"
    }
  }
];
