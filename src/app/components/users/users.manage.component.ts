import {Component, OnInit, OnDestroy, AfterViewInit, EventEmitter, Input, ViewChild} from '@angular/core';
import {WsService} from '../../kernel/services/ws.service';
import {TablePage} from '../../kernel/model/table-page';
import {ApiOptions} from '../../kernel/config/api.config';
import {User} from '../../kernel/model/user';
import {UserManage} from '../../kernel/model/user-manage';
import {UsersMock} from '../../kernel/mock/users.mock';
import {deserialize} from 'json-typescript-mapper';
import {ApiService} from '../../kernel/services/api.service';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {MzModalComponent} from "ngx-materialize";
import {map, filter, catchError, mergeMap, finalize} from 'rxjs/operators';
import {PermissionsLists} from "../../kernel/model/permissions-lists";
import {Permission} from "../../kernel/model/Permission";
import {PermissionList} from "../../kernel/model/permission-list";
import {SessionSingleton} from "../../kernel/singletons/session.singleton";
import {CustomTranslatesService} from "../../kernel/services/custom-translates.service";
import {PermissionListManage} from "../../kernel/model/permission-list-manage";
import {CustomTranslate} from "../../kernel/model/custom-translate";

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
  public userInfo: User = new User();
  @ViewChild('userEditModal') userEditModal: MzModalComponent;
  @ViewChild('userDelModal') userDelModal: MzModalComponent;

  public modalOptions: Materialize.ModalOptions = {
    dismissible: false, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '100%', // Starting top style attribute
    endingTop: '10%', // Ending top style attribute
  };

  constructor(private serverResultsService: UsersMock, private ws: WsService, private api: ApiService, private toastr: ToastrService, private translate: TranslateService, private singleton: SessionSingleton, public cTranslate: CustomTranslatesService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  /* Manage user */
  modalUser: User = new User();
  editTypeAdd: boolean = false;

  addUserModal() {
    this.modalUser = new User();
    this.editTypeAdd = true;
    this.userEditModal.openModal();
  }

  editUserModal(user: User) {
    this.modalUser = user;
    this.editTypeAdd = false;
    this.userEditModal.openModal();
  }

  editUserRest() {
    let call, typeName;
    if (this.editTypeAdd) {
      call = this.api.put("rest/users/add", this.modalUser);
      typeName = "add";
    }
    else {
      call = this.api.post("rest/users/mod", this.modalUser);
      typeName = "edit";
    }

    call.pipe(finalize(() => {
      this.userEditModal.closeModal();
    })).subscribe(
      (data: HttpResponse<User>) => {

      },
      (error: HttpErrorResponse) => {

      });
  }

  delUserModal(user: User) {
    this.modalUser = user;
    this.userDelModal.openModal();
  }

  delUserRest() {
    this.api.del("rest/users/delete/" + this.modalUser.dni)
      .pipe(finalize(() => {
        this.userDelModal.closeModal();
      }))
      .subscribe(
        (data: HttpResponse<User>) => {

        },
        (error: HttpErrorResponse) => {
        }
      );
    //fire modal
  }

  ngOnInit(): void {
    this.loading = true;
    this.setPage({offset: 0});

    this.singleton.getUser().then((user: User) => {
      this.userInfo = user;
    });
    this.loadAvailablePermissionLists();
  }

  loadAvailablePermissionLists() {
    this.api.get("rest/crud/permission/lists").subscribe((permissionLists: Array<PermissionList>) => {
      this.permissionLists = permissionLists;
    });
  }

  ngOnDestroy(): void {
    this.ws.unsubscribe("scm/permissions_manage");
    this.ws.unsubscribe("scm/users_manage");
  }

  ngAfterViewInit() {
    this.ws.subscribe("scm/permissions_manage", this.onPermissionListManage.bind(this));
    this.ws.subscribe("scm/users_manage", this.onUserManage.bind(this));
  }

  private onUserManage(uri: any, data: any) {
    let action: UserManage = deserialize(UserManage, JSON.parse(data)),
      userIndex: number = this.rows.findIndex(x => x.dni === action.target_user.dni);
    switch (action.type.name) {
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


  @ViewChild('managePermissionsModal') managePermissionsModal: MzModalComponent;

  activeModalUser: User = new User();
  activeModalPermissions: Array<Permission> = new Array<Permission>();
  permissionLists: Array<PermissionList> = new Array<PermissionList>();

  getPermissionIndex(permission: Permission) {
    return this.activeModalPermissions.findIndex(x => x.id == permission.id);
  }

  selectPermissions(userPermissions: Array<Permission>) {
    userPermissions.forEach((checkedPermission: Permission) => {
      let status = this.activeModalPermissions[this.getPermissionIndex(checkedPermission)].checked;
      this.activeModalPermissions[this.getPermissionIndex(checkedPermission)].checked = !status;
    });
  }

  openPermissionsModal(row: User) {
    this.activeModalUser = row;

    this.api.get("rest/crud/permission").subscribe((permissions: Array<Permission>) => {
      this.activeModalPermissions = permissions;
      this.api.get("rest/crud/permission/user/" + this.activeModalUser.id).subscribe((userPermissions: Array<Permission>) => {
        if (userPermissions.length > 0) {
          this.selectPermissions(userPermissions);
        }
        this.managePermissionsModal.openModal();
      });
    });
  }

  setPredefinedPermissions(permissionListId: number) {
    /* Limpiar valores actuales */
    this.activeModalPermissions.forEach((permission: Permission) => {
      this.activeModalPermissions[this.getPermissionIndex(permission)].checked = false;
    });
    /* Poner los nuevos */
    this.api.get("rest/crud/permission/list/" + permissionListId).subscribe((checkedPermissions: Array<PermissionsLists>) => {
      if (checkedPermissions.length > 0) {
        checkedPermissions.forEach((checkedPermission: PermissionsLists) => {
          let status = this.activeModalPermissions[this.getPermissionIndex(checkedPermission.id_permission)].checked;
          this.activeModalPermissions[this.getPermissionIndex(checkedPermission.id_permission)].checked = !status;
        });
      }
      this.managePermissionsModal.openModal();
    });
  }

  private onPermissionListManage(uri: any, data: any) {
    let action: PermissionListManage = deserialize(PermissionListManage, JSON.parse(data)),
      permissionIndex: number = this.permissionLists !== null ? this.permissionLists.findIndex(x => x.id === action.permission_list.id) : -1;
    switch (action.type.name) {
      case "ADD":
        this.permissionLists.push(action.permission_list);
        break;
      case "DELETE":
        this.permissionLists.splice(permissionIndex, 1);
        break;
      case "EDIT":
        this.permissionLists[permissionIndex] = action.permission_list;
        break;
    }
  }

  editPermissionListRest() {
    let checkedPermissionsLists = new Array<Permission>();
    this.activeModalPermissions.forEach((permission: Permission) => {
      if (permission.checked) {
        checkedPermissionsLists.push(permission);
      }
    });

    this.api.post("rest/crud/permission/user/relation/" + this.activeModalUser.id, checkedPermissionsLists).subscribe(() => {
    }, () => {
    }, () => {
      /* Reset values */
      this.managePermissionsModal.closeModal();
      this.activeModalUser = new User();
      this.activeModalPermissions = new Array<Permission>();
    });
  }

}
