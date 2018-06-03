import {Component, OnInit, OnDestroy, AfterViewInit, EventEmitter, Input} from '@angular/core';
import {WsService} from '../kernel/services/ws.service';
import {TablePage} from '../kernel/model/table-page';
import {ApiOptions} from '../kernel/config/api.config';
import {Config} from '../kernel/model/config';
import {ConfigManage} from '../kernel/model/config-manage';
import {ConfigMock} from '../kernel/mock/config.mock';
import {ApiService} from '../kernel/services/api.service';
import {NotificationsService} from 'angular2-notifications';
import {TranslateService} from '@ngx-translate/core';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {deserialize} from 'json-typescript-mapper';
@Component({
    templateUrl: '../templates/config.component.html',
    providers: [
        ConfigMock
    ],
})

export class ConfigComponent implements OnInit, AfterViewInit, OnDestroy {
    page = new TablePage();
    rows = new Array<Config>();
    loading: boolean = false;
    ranks: number[] = ApiOptions.ranks;

    constructor(private serverResultsService: ConfigMock, private ws: WsService, private api: ApiService, private notify: NotificationsService, private translate: TranslateService) {
        this.page.pageNumber = 0;
        this.page.size = 10;
    }

    /* Manage config */
    modalConfig: Config = new Config();
    editConfigModal(config: Config) {
        this.modalConfig = new Config(config);
    }
    editConfigRest() {
        this.api.post("config/mod", this.modalConfig).finally(() => {
            this.modalConfig = new Config();
        }).subscribe(
            (data: HttpResponse<Config>) => {
                this.notify.success(
                    this.translate.get("notifications")["value"]["config"]["edit"]["success"]["title"],
                    this.translate.get("notifications")["value"]["config"]["edit"]["success"]["desc"]
                );
            },
            (error: HttpErrorResponse) => {
                if (error.status === 405) {
                    this.notify.error(
                        this.translate.get("notifications")["value"]["config"]["edit"]["400"]["title"],
                        this.translate.get("notifications")["value"]["config"]["edit"]["400"]["desc"]
                    );
                }
                else {
                    this.notify.error(
                        this.translate.get("notifications")["value"]["config"]["edit"]["error"]["title"],
                        this.translate.get("notifications")["value"]["config"]["edit"]["error"]["desc"]
                    );
                }
            });
    }
    ngOnInit(): void {
        this.loading = true;
        this.setPage({offset: 0});
    }

    ngOnDestroy(): void {
        this.ws.unsubscribe("scm/config_manage");
    }
    ngAfterViewInit() {
        this.ws.subscribe("scm/config_manage", this.onChangeConfig.bind(this));
    }
    private onChangeConfig(uri: any, data: any) {
        let action: ConfigManage = deserialize(ConfigManage, JSON.parse(data)),
            configIndex: number = this.rows.findIndex(x => x.config === action.target_config.config)
        this.rows[configIndex] = action.target_config;
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
        this.serverResultsService.getAllConfigs(this.page).subscribe(pagedData => {
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
