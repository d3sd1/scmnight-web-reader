import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {CustomLanguageCrud} from "../../kernel/crud/CustomLanguageCrud";
import {WsService} from "../../kernel/services/ws.service";
import {ApiService} from "../../kernel/services/api.service";
import {SessionSingleton} from "../../kernel/singletons/session.singleton";
import {CustomTranslatesService} from "../../kernel/services/custom-translates.service";
import {ConflictReason} from "../../kernel/model/conflict-reason";
import {ConflictReasonManage} from "../../kernel/model/conflict-reason-manage";

/*
Paso 0º: Cambiar la template a:
crud.customtranslate.component.html -> SE UTILIZA CUANDO EL CRUD ACTUAL NECESITA CLAVES DE IDIOMA EN DB (CONFIGURABLES POR EL USUARIX)
crud.common.component.html -> CRUD SENCILLO Y NORMAL.
 */
@Component({
  templateUrl: '../../templates/crud.customtranslate.component.html'
})

/*
Paso 1º: Cambiar la clase TypeToken de:
CustomLanguageCrud<CLASE> -> SE UTILIZA CUANDO EL CRUD ACTUAL NECESITA CLAVES DE IDIOMA EN DB (CONFIGURABLES POR EL USUARIX)
CommonCrud<CLASE> -> CRUD SENCILLO Y NORMAL.
 */
export class ConflictreasonsManageComponent extends CustomLanguageCrud<ConflictReason, ConflictReasonManage> implements OnInit, AfterViewInit, OnDestroy {

  /* Paso 2º: Editar esta info */
  protected PAGE_NAME = "CONFLICT";
  protected WS_CHANNEL = "scm/conflictreasons_manage";
  protected REST_URL = "conflictive/reasons";
  protected DATA_PK = "id";
  protected MANAGE_FIELD = "conflict_reason";
  public TRANSLATE_FIELD = "name";


  constructor(ws: WsService, api: ApiService, singleton: SessionSingleton, cTranslate: CustomTranslatesService) {
    /* Paso 3: Cambiar el 5º parámetro por la misma clase que el paso 1º. El 6º parámetro es la clase para los logs. */
    super(api, ws, singleton, cTranslate, ConflictReason, ConflictReasonManage);
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


}
