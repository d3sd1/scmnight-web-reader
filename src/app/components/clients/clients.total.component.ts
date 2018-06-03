import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {WsService} from '../../kernel/services/ws.service';
import {TablePage} from '../../kernel/model/table-page';
import {ClientEntrance} from '../../kernel/model/client-entrance';
import {ClientsMock} from '../../kernel/mock/clients.mock';
import {deserialize} from 'json-typescript-mapper';
@Component({
    templateUrl: '../../templates/clients.total.component.html',
    providers: [
        ClientsMock
    ],
})

export class ClientsTotalComponent implements OnInit, AfterViewInit, OnDestroy {
    page = new TablePage();
    rows = new Array<ClientEntrance>();
    loading: boolean = false;

    ngOnInit(): void {
        this.loading = true;
        this.setPage({offset: 0});
    }

    ngOnDestroy(): void {
        this.ws.unsubscribe("scm/clients");
    }
    ngAfterViewInit() {
        this.ws.subscribe("scm/clients", this.onClientJoin.bind(this));
    }
    onClientJoin(uri: any, data: any) {
        this.rows.unshift(deserialize(ClientEntrance, JSON.parse(data)));
        this.page.totalElements++;
    }

    constructor(private serverResultsService: ClientsMock, private ws: WsService) {
        this.page.pageNumber = 0;
        this.page.size = 10;
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
