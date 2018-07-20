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
import {RoomClientDataComponent} from "../../components/room/clients.data.component";
import {ConflictreasonsManageComponent} from "../../components/room/conflictreasons.manage.component";
import {ServerStatusComponent} from "../../components/server.status.component";
import {RatesManageComponent} from "../../components/room/rates.manage.component";
import {StockManageComponent} from "../../components/stock/stock.manage.component";
import {PermissionsManageComponent} from "../../components/users/permissions.manage.component";
import {CustomTranslateManageComponent} from "../../components/custom-translate.manage.component";

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
        path: 'permissions',
        component: PermissionsManageComponent,
        data: {
          requiredPermission: "MANAGE_PERMISSIONS"
        },
      },
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
        path: 'info',
        component: RoomClientDataComponent,
        data: {
          requiredPermission: "SET_CLIENT_INFO"
        }
      },
      {
        path: 'conflicts',
        component: ConflictreasonsManageComponent,
        data: {
          requiredPermission: "MANAGE_ROOM_CONFLICTS"
        }
      },
      {
        path: 'rates',
        component: RatesManageComponent,
        data: {
          requiredPermission: "MANAGE_ROOM_RATES"
        }
      },
      {
        path: 'image',
        component: UsersManageComponent,
        data: {
          requiredPermission: "MANAGE_ROOM_THEME"
        }
      },
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
    path: 'stock',
    data: {
      icon: "food-fork-drink"
    },
    children: [
      {
        path: 'manage',
        component: StockManageComponent,
        data: {
          requiredPermission: "MANAGE_STOCK"
        }
      },
      {
        path: 'types',
        component: UsersManageComponent,
        data: {
          requiredPermission: "MANAGE_STOCK_TYPES"
        }
      },
      {
        path: 'sell',
        component: UsersManageComponent,
        data: {
          requiredPermission: "SELL_STOCK"
        }
      }
    ]
  },
  {
    path: 'stats',
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
    path: 'translate',
    component: CustomTranslateManageComponent,
    data: {
      icon: "translate",
      requiredPermission: "MANAGE_TRANSLATES"
    }
  },
  {
    path: 'config',
    component: ConfigComponent,
    data: {
      icon: "settings",
      requiredPermission: "MANAGE_CONFIG"
    }
  },
  {
    path: 'status',
    component: ServerStatusComponent,
    data: {
      icon: "server",
      requiredPermission: "VIEW_SERVER_STATUS"
    }
  }
];
