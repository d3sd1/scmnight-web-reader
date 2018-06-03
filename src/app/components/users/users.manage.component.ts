import {Component, OnInit, OnDestroy, AfterViewInit, EventEmitter, Input} from '@angular/core';
import {WsService} from '../../kernel/services/ws.service';
import {TablePage} from '../../kernel/model/table-page';
import {ApiOptions} from '../../kernel/config/api.config';
import {User} from '../../kernel/model/user';
import {UserManage} from '../../kernel/model/user-manage';
import {UsersMock} from '../../kernel/mock/users.mock';
import {deserialize} from 'json-typescript-mapper';
import {ApiService} from '../../kernel/services/api.service';
import {NotificationsService} from 'angular2-notifications';
import {TranslateService} from '@ngx-translate/core';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
@Component({
    templateUrl: '../../templates/users.manage.component.html',
    providers: [
        UsersMock
    ],
})

export class UsersManageComponent implements OnInit, AfterViewInit, OnDestroy {
    page = new TablePage();
    rows = new Array<User>();
    loading: boolean = false;
    ranks: number[] = ApiOptions.ranks;

    constructor(private serverResultsService: UsersMock, private ws: WsService, private api: ApiService, private notify: NotificationsService, private translate: TranslateService) {
        this.page.pageNumber = 0;
        this.page.size = 10;
    }

    /* Manage user */
    modalUser: User = new User();
    editTypeAdd: boolean = false;
    addUserModal() {
        this.modalUser = new User();
        this.editTypeAdd = true;
    }
    editUserModal(user: User) {
        this.modalUser = user;
        this.editTypeAdd = false;
    }
    editUserRest() {
        //fire modal
        let call, typeName;
        if (this.editTypeAdd) {
            call = this.api.put("users/add", this.modalUser);
            typeName = "add";
        }
        else {
            call = this.api.post("users/mod", this.modalUser);
            typeName = "edit";
        }

        call.finally(() => {

        }).subscribe(
            (data: HttpResponse<User>) => {
                this.notify.success(
                    this.translate.get("notifications")["value"]["users"][typeName]["success"]["title"],
                    this.translate.get("notifications")["value"]["users"][typeName]["success"]["desc"]
                );
            },
            (error: HttpErrorResponse) => {
                if (error.status === 405) {
                    this.notify.error(
                        this.translate.get("notifications")["value"]["users"]["add"]["405"]["title"],
                        this.translate.get("notifications")["value"]["users"]["add"]["405"]["desc"]
                    );
                }
                else if (error.status === 416) {
                    this.notify.error(
                        this.translate.get("notifications")["value"]["users"]["edit"]["416"]["title"],
                        this.translate.get("notifications")["value"]["users"]["edit"]["416"]["desc"]
                    );
                }
                else if (error.status === 417) {
                    this.notify.error(
                        this.translate.get("notifications")["value"]["users"]["add"]["417"]["title"],
                        this.translate.get("notifications")["value"]["users"]["add"]["417"]["desc"]
                    );
                }
                else {
                    this.notify.error(
                        this.translate.get("notifications")["value"]["users"][typeName]["error"]["title"],
                        this.translate.get("notifications")["value"]["users"][typeName]["error"]["desc"]
                    );
                }
            });
    }
    delUserModal(user: User) {
        this.modalUser = user;
    }
    delUserRest() {
        this.api.del("users/delete/" + this.modalUser.dni)
            .finally(() => {

            })
            .subscribe(
            (data: HttpResponse<User>) => {
                this.notify.success(
                    this.translate.get("notifications")["value"]["users"]["delete"]["success"]["title"],
                    this.translate.get("notifications")["value"]["users"]["delete"]["success"]["desc"]
                );
            },
            (error: HttpErrorResponse) => {
                if (error.status === 416) {
                    this.notify.error(
                        this.translate.get("notifications")["value"]["users"]["delete"]["416"]["title"],
                        this.translate.get("notifications")["value"]["users"]["delete"]["416"]["desc"]
                    );
                }
                else if (error.status === 405) {
                    this.notify.error(
                        this.translate.get("notifications")["value"]["users"]["delete"]["405"]["title"],
                        this.translate.get("notifications")["value"]["users"]["delete"]["405"]["desc"]
                    );
                }
                else {
                    this.notify.error(
                        this.translate.get("notifications")["value"]["users"]["delete"]["error"]["title"],
                        this.translate.get("notifications")["value"]["users"]["delete"]["error"]["desc"]
                    );
                }
            }
            );
        //fire modal
    }

    errorHandler(error: any): void {
        console.log(error)
    }
    ngOnInit(): void {
        this.loading = true;
        this.setPage({offset: 0});
    }

    ngOnDestroy(): void {
        this.ws.unsubscribe("scm/users_manage");
    }
    ngAfterViewInit() {
        this.ws.subscribe("scm/users_manage", this.onUserManage.bind(this));
    }
    private onUserManage(uri: any, data: any) {
        let action:UserManage = deserialize(UserManage, JSON.parse(data)),
            userIndex: number = this.rows.findIndex(x => x.dni === action.target_user.dni);
        switch (action.type)
        {
            case "ADD":
                this.rows.push(action.target_user);
                this.page.totalElements++;
            break;
            case "DELETE":
                this.rows.splice(userIndex, 1);
                this.page.totalElements--;
            break;
            case "EDIT":
                this.rows[userIndex] = action.target_user;
            break;
        }
    }

    setPage(pageInfo) {
        if (pageInfo.offset !== false) {
            this.page.pageNumber = pageInfo.offset;
        }
        if (pageInfo.order) {
            this.page.order["col"] = pageInfo.order.col;
            this.page.order["dir"] = pageInfo.order.dir;
        }
        if (pageInfo.search) {
            this.page.search = pageInfo.search;
        }
        else {
            this.page.search = pageInfo.search;
        }
        this.serverResultsService.getTotalResults(this.page).subscribe(pagedData => {
            this.page = pagedData.page;
            this.rows = pagedData.data;
            this.loading = false;
        });
    }
    setRows(event: Object) {
        this.page.size = parseInt(event["target"]["value"]);
        this.setPage({});
    }
    onSort(event) {
        this.loading = true;
        this.setPage({
            offset: 0,
            order: {
                col: event.sorts[0].prop,
                dir: event.sorts[0].dir
            }
        });
    }
    onSearch(event) {
        this.loading = true;
        this.setPage({
            offset: 0,
            search: event.target.value.toLowerCase()
        });
    }

}
