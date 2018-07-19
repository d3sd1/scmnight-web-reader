import {Component, OnInit, OnDestroy, AfterViewInit, ViewChild} from '@angular/core';
import {WsService} from '../../kernel/services/ws.service';
import {TablePage} from '../../kernel/model/table-page';
import {User} from '../../kernel/model/user';
import {UsersMock} from '../../kernel/mock/users.mock';
import {ApiService} from '../../kernel/services/api.service';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {MzModalComponent} from "ngx-materialize";
import {ConflictreasonsMock} from "../../kernel/mock/conflictreasons.mock";
import {ConflictReason} from "../../kernel/model/conflict-reason";
import {deserialize} from "json-typescript-mapper";
import {ConflictReasonManage} from "../../kernel/model/conflict-reason-manage";
import {finalize} from 'rxjs/operators';
import {CustomTranslatesService} from "../../kernel/services/custom-translates.service";
import {SessionSingleton} from "../../kernel/singletons/session.singleton";
import {CustomLang} from "../../kernel/model/custom-lang";
import {CustomTranslate} from "../../kernel/model/custom-translate";

@Component({
  templateUrl: '../../templates/conflictreasons.manage.component.html',
  providers: [
    ConflictreasonsMock
  ],
})

export class ConflictreasonsManageComponent implements OnInit, AfterViewInit, OnDestroy {
  page = new TablePage();
  rows = new Array<ConflictReason>();
  loading: boolean = false;
  userInfo: User = new User();
  customLangs: Array<CustomLang> = new Array<CustomLang>();

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

  constructor(private serverResultsService: ConflictreasonsMock, private ws: WsService, private api: ApiService, private singleton: SessionSingleton, private cTranslate: CustomTranslatesService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  /* Manage user */
  modalConflictReason: ConflictReason = new ConflictReason();
  modalSetLangs = [];
  editTypeAdd: boolean = false;

  initLanguages() {
    console.log("init");
    this.modalSetLangs = [];
    console.log(this.modalSetLangs);
    this.customLangs.forEach((lang) => {
      const newLang = new CustomTranslate();
      newLang.lang_key.lang_key = lang.lang_key;
      newLang.value = this.cTranslate.getTranslate('CONFLICT.' + this.modalConflictReason.name, lang.lang_key);
      newLang.key_id = 'CONFLICT.' + this.modalConflictReason.name;

      this.modalSetLangs[lang.lang_key] = newLang;
    });
  }

  addUserModal() {
    this.modalConflictReason = new ConflictReason();
    this.editTypeAdd = true;
    this.initLanguages();
    this.conflictReasonEditModal.openModal();
  }

  editUserModal(conflictReason: ConflictReason) {
    this.modalConflictReason = conflictReason;
    this.editTypeAdd = false;
    this.initLanguages();
    this.conflictReasonEditModal.openModal();
  }

  editUserRest() {
    if (this.editTypeAdd) {
      this.api.put("rest/clients/conflictreason", this.modalConflictReason).pipe(finalize(() => {
        this.conflictReasonEditModal.closeModal();
      })).subscribe();
      ;
    }
    for (let lang in this.modalSetLangs) {
      this.api.post("rest/sessiondata/translates", this.modalSetLangs[lang]).pipe(finalize(() => {
        this.conflictReasonEditModal.closeModal();
      })).subscribe();
    }
  }

  delUserModal(conflictReason: ConflictReason) {
    this.modalConflictReason = conflictReason;
    this.conflictReasonDelModal.openModal();
  }

  delUserRest() {
    this.api.del("rest/clients/conflictreason/" + this.modalConflictReason.id)
      .pipe(finalize(() => {
        this.conflictReasonDelModal.closeModal();
      }))
      .subscribe();

    for (let lang in this.modalSetLangs) {
      this.api.del("rest/sessiondata/translates/").pipe(finalize(() => {
        this.conflictReasonEditModal.closeModal();
      })).subscribe();
    }
  }

  ngOnInit(): void {
    this.loading = true;
    this.setPage({offset: 0});

    this.singleton.getUser().then((user: User) => {
      this.userInfo = user;
    });
    this.singleton.getCustomTranslatesAvailable().then((customLangs: Array<CustomLang>) => {
      this.customLangs = customLangs;
    });
  }

  ngOnDestroy(): void {
    this.ws.unsubscribe("scm/conflictreasons_manage");
  }

  ngAfterViewInit() {
    this.ws.subscribe("scm/conflictreasons_manage", this.onConflictReasonManage.bind(this));
  }

  private onConflictReasonManage(uri: any, data: any) {
    let action: ConflictReasonManage = deserialize(ConflictReasonManage, JSON.parse(data)),
      conflictReasonIndex: number = this.rows.findIndex(x => x.id === action.conflict_reason.id);
    switch (action.type.name) {
      case "ADD":
        this.rows.push(action.conflict_reason);
        this.page.totalElements++;
        break;
      case "DELETE":
        this.rows.splice(conflictReasonIndex, 1);
        this.page.totalElements--;
        break;
      case "EDIT":
        this.rows[conflictReasonIndex] = action.conflict_reason;
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
