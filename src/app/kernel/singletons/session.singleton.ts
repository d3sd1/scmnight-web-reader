import {Injectable} from '@angular/core';

import {ApiService} from '../services/api.service';
import {User} from '../model/user';
import {HttpErrorResponse} from '@angular/common/http';
import {Permission} from "../model/Permission";
import {Config} from "../model/config";
import {DiscoInfo} from "../model/disco-info";

@Injectable()
export class SessionSingleton {
  constructor(private api: ApiService) {
  }

  private user: User = null;
  private userPermissions: Array<Permission> = null;
  private discoInfo: DiscoInfo = null;

  private apiLoadingUser: Promise<User> = null;
  private apiLoadingPermissions: Promise<Array<Permission>> = null;
  private apiLoadingDiscoInfo: Promise<DiscoInfo> = null;

  getUser(): Promise<User> {
    return new Promise((resolveGeneral, rejectGeneral) => {
      if (this.user === null) {
        if (this.apiLoadingUser === null) {
          this.apiLoadingUser = new Promise((resolveInternal, rejectInternal) => {
            this.api.get('rest/session/userinfo')
              .subscribe(
                (user: User) => {
                  this.apiLoadingUser = null;
                  this.user = user;
                  resolveInternal(this.user);
                  resolveGeneral(this.user);
                },
                (err: HttpErrorResponse) => {
                  /* Fix para prevenir bucle */
                  resolveInternal(new User());
                  resolveGeneral(new User());
                });
          });
        }
        else {
          this.apiLoadingUser.then(res => {
            resolveGeneral(this.user)
          });
        }
      }
      else {
        resolveGeneral(this.user);
      }
    });
  }

  getDiscoInfo(): Promise<DiscoInfo> {
    return new Promise((resolveGeneral, rejectGeneral) => {
      if (this.discoInfo === null) {
        if (this.apiLoadingDiscoInfo === null) {
          this.apiLoadingDiscoInfo = new Promise((resolveInternal, rejectInternal) => {
            this.api.get('rest/sessiondata/discoinfo')
              .subscribe(
                (discoInfo: DiscoInfo) => {
                  this.apiLoadingDiscoInfo = null;
                  this.discoInfo = discoInfo;
                  resolveInternal(this.discoInfo);
                  resolveGeneral(this.discoInfo);
                },
                (err: HttpErrorResponse) => {
                  /* Fix para prevenir bucle */
                  resolveInternal(new DiscoInfo());
                  resolveGeneral(new DiscoInfo());
                });
          });
        }
        else {
          this.apiLoadingDiscoInfo.then(res => {
            resolveGeneral(this.discoInfo)
          });
        }
      }
      else {
        resolveGeneral(this.discoInfo);
      }
    });
  }

  getPermissions(): Promise<Array<Permission>> {
    return new Promise((resolveGeneral, rejectGeneral) => {
      if (this.userPermissions === null) {
        if (this.apiLoadingPermissions === null) {
          this.apiLoadingPermissions = new Promise((resolveInternal, rejectInternal) => {
            this.api.get('rest/session/userpermissions')
              .subscribe(
                (permissions: Array<Permission>) => {
                  this.apiLoadingPermissions = null;
                  if (null == permissions || typeof permissions == "undefined" || permissions.length == 0) {
                    this.userPermissions = [];
                  }
                  else {
                    this.userPermissions = permissions;
                  }
                  resolveInternal(this.userPermissions);
                  resolveGeneral(this.userPermissions);
                },
                (err: HttpErrorResponse) => {
                  /* Fix para prevenir bucle */
                  resolveInternal([new Permission()]);
                  resolveGeneral([new Permission()]);
                });
          });
        }
        else {
          this.apiLoadingPermissions.then(res => {
            resolveGeneral(this.userPermissions)
          });
        }
      }
      else {
        resolveGeneral(this.userPermissions);
      }
    });
  }
}
