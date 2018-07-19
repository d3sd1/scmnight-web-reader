import {Component, OnInit, OnDestroy, AfterViewInit, ViewChild} from '@angular/core';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {MzModalComponent} from "ngx-materialize";
import {deserialize} from "json-typescript-mapper";
import {map, filter, catchError, mergeMap, finalize} from 'rxjs/operators';
import {CustomTranslatesMock} from "../kernel/mock/custom-translates.mock";
import {TablePage} from "../kernel/model/table-page";
import {CustomTranslate} from "../kernel/model/custom-translate";
import {WsService} from "../kernel/services/ws.service";
import {ApiService} from "../kernel/services/api.service";
import {TranslateService} from "@ngx-translate/core";
import {SessionSingleton} from "../kernel/singletons/session.singleton";
import {User} from "../kernel/model/user";

@Component({
  templateUrl: '../templates/custom-translates.manage.component.html',
  providers: [
    CustomTranslatesMock
  ],
})

export class CustomTranslateManageComponent implements OnInit, AfterViewInit, OnDestroy {
  page = new TablePage();
  allRows = new Array<CustomTranslate>();
  filteredRows = new Array<CustomTranslate>();
  filteredBy: string = "";
  loading: boolean = false;
  langs: object[] = [];
  userInfo: User;
  @ViewChild('conflictReasonEditModal') conflictReasonEditModal: MzModalComponent;
  @ViewChild('conflictReasonDelModal') conflictReasonDelModal: MzModalComponent;

  public modalOptions: Materialize.ModalOptions = {
    dismissible: false, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '100%', // Starting top style attribute
    endingTop: '10%', // Ending top style attribute
  };

  constructor(private serverResultsService: CustomTranslatesMock, private ws: WsService, private api: ApiService, private translate: TranslateService, private singleton: SessionSingleton) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.singleton.getUser().then((user: User) => {
      this.userInfo = user;
      translate.get('langs').subscribe((langsTrans: Array<string>) => {
        this.langs.push({
          key: "all",
          trans: langsTrans["all"]
        });
        this.singleton.getCustomTranslatesAvailable().then((langs) => {
          langs.forEach((lang) => {
            this.langs.push({
              key: lang.lang_key,
              trans: langsTrans[lang.lang_key]
            });
          });
        });
      });
    });
  }

  filterByLang(event: CustomEvent) {
    const lang = event.detail;
    this.filteredBy = lang;
    this.filteredRows = new Array<CustomTranslate>();
    this.allRows.forEach((trans: CustomTranslate) => {
      if (trans.lang_key.lang_key == lang || lang == "all") {
        this.filteredRows.push(trans);
      }
    });
  }

  /* Manage lang key */
  modalLang: CustomTranslate = new CustomTranslate();
  editTypeAdd: boolean = false;

  editUserModal(modalLang: CustomTranslate) {
    this.modalLang = modalLang;
    console.log(this.modalLang);
    this.editTypeAdd = false;
    this.conflictReasonEditModal.openModal();
  }

  editLangRest() {
    this.api.post("rest/sessiondata/translates", this.modalLang).pipe(finalize(() => {
      this.conflictReasonEditModal.closeModal();
    })).subscribe();
  }


  ngOnInit(): void {
    this.loading = true;
    this.setPage({offset: 0});
  }

  ngOnDestroy(): void {
    this.ws.unsubscribe("scm/translations");
  }

  ngAfterViewInit() {
    this.ws.subscribe("scm/translations", this.onLangManage.bind(this));
  }

  private onLangManage(uri: any, data: any) {
    let translation: CustomTranslate = deserialize(CustomTranslate, JSON.parse(data));
    this.filteredRows.forEach((row: CustomTranslate, index) => {
      if (translation.key_id == row.key_id && translation.lang_key.lang_key == row.lang_key.lang_key) {
        this.filteredRows[index] = translation;
      }
    });
    this.allRows.forEach((row: CustomTranslate, index) => {
      if (translation.key_id == row.key_id && translation.lang_key.lang_key == row.lang_key.lang_key) {
        this.allRows[index] = translation;
      }
    });
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
      this.allRows = pagedData.data;

      this.singleton.getUser().then((user: User) => {
        this.filterByLang(new CustomEvent('AutoLangSelector',
          {
            bubbles: true,
            cancelable: true,
            detail: user.lang_code
          }));
      });
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
