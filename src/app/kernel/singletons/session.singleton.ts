import {Injectable} from '@angular/core';

import {ApiService} from '../services/api.service';
import {User} from '../model/user';
import {HttpErrorResponse} from '@angular/common/http';
import {Permission} from "../model/Permission";
import {Config} from "../model/config";
import {DiscoInfo} from "../model/disco-info";
import {CustomTranslate} from "../model/custom-translate";
import {CustomLang} from "../model/custom-lang";
import {SessionService} from "../services/session.service";
import {Router} from "@angular/router";


@Injectable()
export class SessionSingleton {
  constructor(private api: ApiService, private sessMan: SessionService, private router:Router) {
  }

  private user: User = null;
  private userPermissions: Array<Permission> = null;
  private discoInfo: DiscoInfo = null;
  private customTranslates: Array<CustomTranslate> = null;
  private customAvailableLangs: Array<CustomLang> = null;

  private apiLoadingUser: Promise<User> = null;
  private apiLoadingPermissions: Promise<Array<Permission>> = null;
  private apiLoadingDiscoInfo: Promise<DiscoInfo> = null;
  private apiLoadingCustomLanguages: Promise<Array<CustomLang>> = null;

  getCustomTranslatesAvailable(forceReload = false): Promise<Array<CustomLang>> {
    return new Promise((resolveGeneral, rejectGeneral) => {
      if (this.customTranslates === null || forceReload) {
        if (this.apiLoadingCustomLanguages === null) {
          this.apiLoadingCustomLanguages = new Promise((resolveInternal, rejectInternal) => {
            this.getUser().then(user => {
              this.api.get('rest/session/translates/available')
                .subscribe(
                  (customAvailableLangs: Array<CustomLang>) => {
                    this.apiLoadingCustomLanguages = null;
                    this.customAvailableLangs = customAvailableLangs;
                    resolveInternal(this.customAvailableLangs);
                    resolveGeneral(this.customAvailableLangs);
                  },
                  (err: HttpErrorResponse) => {
                    /* Fix para prevenir bucle */
                    resolveInternal([new CustomLang()]);
                    resolveGeneral([new CustomLang()]);
                  });
            });
          });
        }
        else {
          this.apiLoadingCustomLanguages.then(res => {
            resolveGeneral(this.customAvailableLangs)
          });
        }
      }
      else {
        resolveGeneral(this.customAvailableLangs);
      }
    });
  }

  getUser(forceReload = false): Promise<User> {
    return new Promise((resolveGeneral, rejectGeneral) => {
      const token = this.sessMan.getToken();
      if ((this.user === null || forceReload) && token !== null && token != "") {
        if (this.apiLoadingUser === null && !forceReload) {
          this.apiLoadingUser = new Promise((resolveInternal, rejectInternal) => {
            this.api.get('rest/user/info')
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
        else if (forceReload && token !== null && token != "") {
          this.apiLoadingUser = new Promise((resolveInternal, rejectInternal) => {
            this.api.get('rest/user/info')
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
            this.api.get('rest/session/discoinfo')
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
            this.api.get('rest/user/permissions')
              .subscribe(
                (permissions: Array<Permission>) => {
                  this.apiLoadingPermissions = null;
                  const token = this.sessMan.getToken();
                  if ((null == permissions || typeof permissions == "undefined" || permissions.length == 0) && token !== null && token != "") {
                    this.sessMan.delToken();
                    this.router.navigate(["error/600"]);
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
