import {Component, OnInit, OnDestroy, AfterViewInit, EventEmitter, Input} from '@angular/core';
import {WsService} from '../../kernel/services/ws.service';
import {TablePage} from '../../kernel/model/table-page';
import {ApiOptions} from '../../kernel/config/api.config';
import {User} from '../../kernel/model/user';
import {UserEntrance} from '../../kernel/model/user-entrance';
import {UsersMock} from '../../kernel/mock/users.mock';
import {deserialize} from 'json-typescript-mapper';
import {ApiService} from '../../kernel/services/api.service';
import {NotificationsService} from 'angular2-notifications';
import {TranslateService} from '@ngx-translate/core';

@Component({
    templateUrl: '../../templates/users.total.component.html',
    providers: [
        UsersMock
    ],
})

export class UsersTotalComponent implements OnInit, AfterViewInit, OnDestroy {
    page = new TablePage();
    rows = new Array<UserEntrance>();
    loading: boolean = false;
    delUser: User;
    ranks: number[] = ApiOptions.ranks;

    constructor(private serverResultsService: UsersMock, private ws: WsService, private api: ApiService, private notify: NotificationsService, private translate: TranslateService) {
        this.page.pageNumber = 0;
        this.page.size = 10;
    }


    ngOnInit(): void {
        this.loading = true;
        this.setPage({offset: 0});
    }

    ngOnDestroy(): void {
      this.ws.unsubscribe("scm/users_entrances");
    }
    ngAfterViewInit() {
      this.ws.subscribe("scm/users_entrances", this.onUserJoin.bind(this));
    }
    onUserJoin(uri: any, data: any) {
        this.rows.unshift(deserialize(UserEntrance, JSON.parse(data)));
        this.page.totalElements++;
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
        this.serverResultsService.getHistoricalResults(this.page).subscribe(pagedData => {
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
