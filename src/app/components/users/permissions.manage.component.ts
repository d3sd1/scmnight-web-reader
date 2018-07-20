import {Component, OnInit, OnDestroy, AfterViewInit, ViewChild} from '@angular/core';
import {CustomLanguageCrud} from "../../kernel/crud/CustomLanguageCrud";
import {WsService} from "../../kernel/services/ws.service";
import {ApiService} from "../../kernel/services/api.service";
import {SessionSingleton} from "../../kernel/singletons/session.singleton";
import {CustomTranslatesService} from "../../kernel/services/custom-translates.service";
import {ConflictReason} from "../../kernel/model/conflict-reason";
import {ConflictReasonManage} from "../../kernel/model/conflict-reason-manage";
import {PermissionList} from "../../kernel/model/permission-list";
import {PermissionListManage} from "../../kernel/model/permission-list-manage";
import {MzModalComponent} from "ngx-materialize";
import {Permission} from "../../kernel/model/Permission";
import {p} from "@angular/core/src/render3";
import {PermissionsLists} from "../../kernel/model/permissions-lists";

/*
Paso 0º: Cambiar la template a:
crud.customtranslate.component.html -> SE UTILIZA CUANDO EL CRUD ACTUAL NECESITA CLAVES DE IDIOMA EN DB (CONFIGURABLES POR EL USUARIX)
crud.common.component.html -> CRUD SENCILLO Y NORMAL.
 */
@Component({
  templateUrl: '../../templates/crud.permissions-list.component.html'
})

/*
Paso 1º: Cambiar la clase TypeToken de:
CustomLanguageCrud<CLASE> -> SE UTILIZA CUANDO EL CRUD ACTUAL NECESITA CLAVES DE IDIOMA EN DB (CONFIGURABLES POR EL USUARIX)
CommonCrud<CLASE> -> CRUD SENCILLO Y NORMAL.
 */
export class PermissionsManageComponent extends CustomLanguageCrud<PermissionList, PermissionListManage> implements OnInit, AfterViewInit, OnDestroy {

  /* Paso 2º: Editar esta info */
  protected PAGE_NAME = "PERMISSION";
  protected WS_CHANNEL = "scm/permissions_manage";
  protected REST_URL = "permission/list";
  protected DATA_PK = "id";
  protected MANAGE_FIELD = "permission_list";
  public TRANSLATE_FIELD = "list_key_name";


  constructor(ws: WsService, api: ApiService, singleton: SessionSingleton, cTranslate: CustomTranslatesService) {
    /* Paso 3: Cambiar el 5º parámetro por la misma clase que el paso 1º. El 6º parámetro es la clase para los logs. */
    super(api, ws, singleton, cTranslate, PermissionList, PermissionListManage);
  }


  ngOnInit(): void {
    this.hookOnInit();
  }

  ngOnDestroy(): void {
    this.hookOnDestroy();
  }

  ngAfterViewInit() {
    this.hookOnViewInit();
  }


  /* Paso 4º: Configurar esto a nuestras necesidades */

  @ViewChild('managePermissionsModal') managePermissionsModal: MzModalComponent;

  activeModalList: PermissionList = new PermissionList();
  activeModalPermissions: Array<Permission> = new Array<Permission>();

  getPermissionIndex(permission: Permission) {
    return this.activeModalPermissions.findIndex(x => x.id == permission.id);
  }

  openPermissionsModal(row: PermissionList) {
    console.log(row);
    this.activeModalList = row;

    this.api.get("rest/crud/permission").subscribe((permissions: Array<Permission>) => {
      console.log(permissions);
      this.activeModalPermissions = permissions;
      this.api.get("rest/crud/permission/list/" + this.activeModalList.id).subscribe((checkedPermissions: Array<PermissionsLists>) => {
        console.log(checkedPermissions);
        if (checkedPermissions.length > 0) {
          checkedPermissions.forEach((checkedPermission: PermissionsLists) => {
            let status = this.activeModalPermissions[this.getPermissionIndex(checkedPermission.id_permission)].checked;
            this.activeModalPermissions[this.getPermissionIndex(checkedPermission.id_permission)].checked = !status;
            console.log(this.activeModalPermissions);
          });
        }
        this.managePermissionsModal.openModal();
      });
    });
  }

  editPermissionListRest() {
    let checkedPermissionsLists = new Array<PermissionsLists>();
    this.activeModalPermissions.forEach((permission: Permission) => {
      if(permission.checked) {
        let permissionListRelation = new PermissionsLists();
        permissionListRelation.id_permission = permission;
        permissionListRelation.id_list = this.activeModalList;
        checkedPermissionsLists.push(permissionListRelation);
      }
    });


    this.api.post("rest/crud/permission/list/relation/" + this.activeModalList.id, checkedPermissionsLists).subscribe(() => {
      /* Reset values */
      this.managePermissionsModal.closeModal();
      this.activeModalList = new PermissionList();
      this.activeModalPermissions = new Array<Permission>();
    });
  }

}
