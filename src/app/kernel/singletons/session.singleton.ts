import {Injectable} from '@angular/core';

import {ApiService} from '../services/api.service';
import {User} from '../model/user';
import {HttpErrorResponse} from '@angular/common/http';
@Injectable()
export class SessionSingleton {
    constructor(private api: ApiService) {}
    private user: User = null;
    private apiLoadingUser: Promise<User> = null;

    getUser(): Promise<User> {
        return new Promise((resolveGeneral, rejectGeneral) => {
            if (this.user === null) {
                if (this.apiLoadingUser === null) {
                    this.apiLoadingUser = new Promise((resolveInternal,rejectInternal) => {
                        this.api.get('session/userinfo')
                            .subscribe(
                                (user: User) => {
                                    this.apiLoadingUser = null;
                                    this.user = user;
                                    resolveInternal(this.user);
                                    resolveGeneral(this.user);
                                },
                        (err:HttpErrorResponse) => {
                            /* Fix para prevenir bucle */
                            resolveInternal(new User());
                            resolveGeneral(new User());
                        });
                    });
                }
                else {
                    this.apiLoadingUser.then(res => {resolveGeneral(this.user)});
                }
            }
            else {
                resolveGeneral(this.user);
            }
        });
    }
}