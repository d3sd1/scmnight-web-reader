import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewChildren,
  EventEmitter,
  Output,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {User} from '../kernel/model/user';
import {NavbarOptions} from '../kernel/config/navbar.config';
import {MenuOption} from '../kernel/model/menu-option';
import {Router, NavigationEnd, Route} from '@angular/router';
import {MenuRoutes} from '../kernel/config/routes.menu.config';
import {MenuOptionData} from '../kernel/model/menu-option-data';
import {SessionSingleton} from '../kernel/singletons/session.singleton';
import {Permission} from "../kernel/model/Permission";
import {MzModalComponent} from "ngx-materialize";

import {UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions} from 'ngx-uploader';
import {finalize} from "rxjs/operators";
import {ApiService} from "../kernel/services/api.service";
import {LoadingBarService} from '@ngx-loading-bar/core';
import {deserialize} from "json-typescript-mapper";
import {ConflictReasonManage} from "../kernel/model/conflict-reason-manage";
import {WsService} from "../kernel/services/ws.service";
import {DomSanitizer, SafeStyle, SafeUrl} from "@angular/platform-browser";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'main-content',
  templateUrl: '../templates/navbar.component.html'
})
export class NavbarComponent implements OnInit, OnDestroy, AfterViewInit {

  options: UploaderOptions;
  uploadInput: EventEmitter<UploadInput>;
  uploadingLogo = false;
  logo: SafeStyle = "";
  canEditLogo = false;
  canUseChat = false;
  discoName: string = "";
  chatUsers = [];
  @ViewChild('changeLogoModal') changeLogoModal: MzModalComponent;

  getChatUsers() {
    if (!this.ws.connected) {
      console.log("wsoffline");
      this.chatUsers = null;
    }
    else {
      console.log("cargar users!");
    }
  }

  isValidLogo(str) {
    var image = new Image();
    image.src = str;
    image.onerror = function (err) {
      return false;
    }
    return str != "";
  }

  setLogo(logo) {
    if (typeof logo !== "undefined" && this.isValidLogo(logo)) {
      this.logo = this._sanitizer.bypassSecurityTrustStyle("url(" + logo + ")");
    }
  }

  ngOnDestroy(): void {
    this.ws.unsubscribe("scm/config_logo");
  }

  ngAfterViewInit() {
    this.ws.subscribe("scm/config_logo", this.onLogoChanged.bind(this));
  }

  private onLogoChanged(uri: any, img: any) {
    this.setLogo(img);
  }

  cancelUpload() {
    if (!this.uploadingLogo) {
      this.changeLogoModal.closeModal();
    }
    else {

      this.translate.get("logo_upload.error_uploading").subscribe((res: string) => {
        this.toastr.error(
          "",
          res
        )
      });
    }
    this.uploadingLogo = false;
  }

  logoUpload($event) {
    this.uploadingLogo = true;
    const reader = new FileReader();
    reader.readAsDataURL($event.target.files[0]);
    reader.onload = () => {
      const img = reader.result;
      this.api.post("rest/config/logo", {"img": img})
        .pipe(finalize(() => {
          this.loadingBar.complete();
        }))
        .subscribe(
          (res) => {
            this.changeLogoModal.closeModal();
            this.uploadingLogo = false;
          });
    };
    reader.onerror = (error) => {
      this.translate.get("logo_upload.error_onupload").subscribe((res: string) => {
        this.toastr.error(
          "",
          res
        );
      });
      this.uploadingLogo = false;
    };
  }

  constructor(public router: Router, private _sanitizer: DomSanitizer, private ws: WsService, private loadingBar: LoadingBarService, private api: ApiService, private translate: TranslateService, private sessionInfo: SessionSingleton, private toastr: ToastrService) {

    this.sessionInfo.getPermissions().then(res => {
      this.canEditLogo = res.findIndex(x => x.action === "CHANGE_LOGO") !== -1;
      this.canUseChat = res.findIndex(x => x.action === "USE_CHAT") !== -1;
    });
    this.sessionInfo.getDiscoInfo().then(res => {
      this.setLogo(res.logo);
      this.discoName = res.discoName;
    });
  }

  public modalOptions: Materialize.ModalOptions = {
    dismissible: false, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '100%', // Starting top style attribute
    endingTop: '10%'
  };

  filteredMenuOptions: MenuOption[] = [];
  menuLoaded: boolean = false;
  user: User;
  private userPermission: Array<Permission>;

  changeLogo() {
    this.changeLogoModal.openModal();
  }

  ngOnInit() {
    this.getChatUsers();
    this.sessionInfo.getDiscoInfo().then(discoInfo => {
      this.sessionInfo.getUser().then(user => {
        this.sessionInfo.getPermissions().then(userPermission => {
          this.userPermission = userPermission;
          this.user = user;
          this.constructMenu();
          this.pickActualMenuOption();
          this.menuOptionPicker();
        });
      });
    });
  }

  private menuOptionPicker() {
    /* Al cambiar de ruta */
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.pickActualMenuOption();
      }
    });
  }

  private pickActualMenuOption() {
    this.filteredMenuOptions.forEach((menuOption: MenuOption) => {
      if (menuOption.submenus != null && menuOption.submenus.length === 0) {
        if (this.router.url === menuOption.link) {
          menuOption.active = true;
        }
        else {
          menuOption.active = false;
        }
      }
      else if (menuOption.submenus != null) {
        let found = false;
        menuOption.submenus.forEach((subMenuOption: MenuOption) => {
          if (this.router.url === subMenuOption.link) {
            subMenuOption.active = true;
            menuOption.active = true;
            found = true;
          }
          else {
            subMenuOption.active = false;
            if (!found) {
              menuOption.active = false;
            }
          }
        });
      }
    });
  }

  private constructMenu() {
    MenuRoutes.forEach((route: Route) => {
      const data = route.data as MenuOptionData;
      if (data.hidden !== true) {
        const link = NavbarOptions.dashboardBase + "/" + route.path;
        var linkHref;
        let submenus = [];
        let submenusHasPermissions = false;
        if (typeof route.children !== "undefined") {
          route.children.forEach((subRoute: Route) => {
            const subData = subRoute.data as MenuOptionData;
            if (!subData.hidden && this.userPermission.find(x => x.action === subData.requiredPermission)) {
              const subLink = link + "/" + subRoute.path;
              this.translate.get("nav." + subLink).subscribe((res: string) => {
                submenus.push(new MenuOption(data.icon, (subData.isProfileText ? this.user.firstname + " " + this.user.lastname : res), subLink));
              });
              submenusHasPermissions = true;
            }
          });
          linkHref = null;
        }
        else {
          linkHref = link;
        }
        if (this.userPermission.find(x => x.action === data.requiredPermission) && typeof route.children === "undefined" || submenusHasPermissions) {
          this.translate.get("nav." + link).subscribe((res: string) => {
            this.filteredMenuOptions.push(new MenuOption(data.icon, (data.isProfileText ? this.user.firstname + " " + this.user.lastname : res), linkHref, submenus));
          });
        }
      }
    });
    this.menuLoaded = true;
  }
}
