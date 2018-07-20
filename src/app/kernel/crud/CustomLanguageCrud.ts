
import {CustomTranslate} from "../model/custom-translate";
import {User} from "../model/user";
import {CustomLang} from "../model/custom-lang";
import {ApiService} from "../services/api.service";
import {CustomTranslatesService} from "../services/custom-translates.service";
import {WsService} from "../services/ws.service";
import {SessionSingleton} from "../singletons/session.singleton";
import {finalize} from "rxjs/operators";
import {NoParamConstructor} from "./Crud";
import {CommonCrud} from "./CommonCrud";

export abstract class CustomLanguageCrud<T, N> extends CommonCrud<T, N> {


  customLangs: Array<CustomLang> = new Array<CustomLang>();
  modalSetLangs = [];

  constructor(api: ApiService, ws: WsService, private singleton: SessionSingleton, private cTranslate: CustomTranslatesService, typeTokenBaseClass: NoParamConstructor<T>, typeTokenManageClass: NoParamConstructor<N>) {
    super(api, ws, typeTokenBaseClass, typeTokenManageClass);
  }

  initLanguages() {
    this.modalSetLangs = [];
    this.customLangs.forEach((lang) => {
      const newLang = new CustomTranslate();
      newLang.lang_key.lang_key = lang.lang_key;
      newLang.value = this.cTranslate.getTranslate(this.PAGE_NAME + this.modalData[this.TRANSLATE_FIELD], lang.lang_key);
      newLang.key_id = this.PAGE_NAME + this.modalData[this.TRANSLATE_FIELD];
      this.modalSetLangs[lang.lang_key] = newLang;
    });
  }

  hookAfterAddRestCall() {
    //TODO: adaptar esto para que funcione
    for (let lang in this.modalSetLangs) {
      this.api.post("rest/sessiondata1/translates", this.modalSetLangs[lang]).pipe(finalize(() => {
        this.manageModal.closeModal();
      })).subscribe();
    }
  }
  hookAfterEditRestCall() {
    for (let lang in this.modalSetLangs) {
      this.api.post("rest/sessiondata2/translates", this.modalSetLangs[lang]).pipe(finalize(() => {
        this.manageModal.closeModal();
      })).subscribe();
    }
  }
  hookAfterDelRestCall() {
    for (let lang in this.modalSetLangs) {
      this.api.del("rest/sessiondata3/translates/").pipe(finalize(() => {
        this.manageModal.closeModal();
      })).subscribe();
    }
  }

  hookOpenAddModal() {
    this.initLanguages();
  }

  hookOpenEditModal() {
    this.initLanguages();
  }

  hookOnCrudInit() {
    this.singleton.getUser().then((user: User) => {
      this.userInfo = user;
    });
    this.singleton.getCustomTranslatesAvailable().then((customLangs: Array<CustomLang>) => {
      this.customLangs = customLangs;
    });
  }
}
