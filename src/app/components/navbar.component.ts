import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewChildren,
  EventEmitter,
  Output,
  OnDestroy,
  AfterViewInit, HostListener
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
import {environment} from "../../environments/environment";
import {HttpHeaders} from "@angular/common/http";
import {ApiOptions} from "../kernel/config/api.config";
import {SessionService} from "../kernel/services/session.service";

@Component({
  selector: 'main-content',
  templateUrl: '../templates/navbar.component.html'
})
export class NavbarComponent implements OnInit, OnDestroy {

  options: UploaderOptions;
  uploadInput: EventEmitter<UploadInput>;
  uploadingLogo = false;
  logo: SafeStyle = "";
  canEditLogo = false;
  canUseChat = false;
  discoName: string = "";
  chatUsers: Array<User> = null;
  firstChatLoad = true;
  inactivityMS: number = 300000; //5 min
  userInactive: boolean = false;
  inactivityTimeout = null;
  settingInactive = false;
  settingActive = false;

  @ViewChild('changeLogoModal') changeLogoModal: MzModalComponent;

  setInactive() {
    if (!this.settingInactive) {
      this.settingInactive = true;
      this.api.post("rest/chat/user/inactive", {}).subscribe(
        (user: User) => {
          this.user.chat_status.chat_status = "IDLE";
          this.userInactive = true;
          this.settingInactive = false;
          this.onChatUpdate(null, user);
        }, () => {
          this.user.chat_status.chat_status = "IDLE";
          this.userInactive = true;
          this.settingInactive = false;
        });
    }
  }

  setActive() {
    if (!this.settingActive) {
      this.settingActive = true;
      this.api.post("rest/chat/user/active", {}).subscribe(
        (user: User) => {
          this.user.chat_status.chat_status = "ONLINE";
          this.userInactive = false;
          this.settingActive = false;
          this.onChatUpdate(null, user);
        }, () => {
          this.user.chat_status.chat_status = "ONLINE";
          this.userInactive = false;
          this.settingActive = false;
        });
    }
  }

  refreshInactivity($event) {
    if (this.canUseChat) {
      if (this.userInactive) {
        this.setActive();
      }
      clearTimeout(this.inactivityTimeout);
      this.inactivityTimeout = setTimeout(() => this.setInactive(), this.inactivityMS);
    }
  }

  loadChat() {
    if (this.canUseChat) {
      if (!this.ws.connected) {
        this.chatUsers = null;
        this.firstChatLoad = true;
      }
      else {
        this.chatUsers = [];
        /* Cargar usuarios del chat */
        this.api.get("rest/chat/users").subscribe(
          (users: Array<User>) => {
            users.forEach((user: User, index: number) => {
              this.onChatUpdate(() => {
                if (index === users.length - 1) {
                  this.firstChatLoad = false;
                }
              }, user);
            });
          }, () => {
            this.firstChatLoad = false;
          });
      }
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
    this.ws.unsubscribe("scm/chat_users");
    this.changeLogoModal.closeModal();
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

  constructor(public router: Router, private _sanitizer: DomSanitizer, public ws: WsService, private loadingBar: LoadingBarService, private api: ApiService, private translate: TranslateService, private sessionInfo: SessionSingleton, private toastr: ToastrService,
  private sessMan:SessionService) {

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

  onChatUpdate(uri: any, data: any) {
    let user: User;
    if (typeof data == "string") {
      user = deserialize(User, JSON.parse(data));
    }
    else {
      user = deserialize(User, data);
    }

    /* prevent actual session user to appear on chat */
    if (user.dni == this.user.dni) {
      return false;
    }
    else if (user.dni == this.user.dni && !this.firstChatLoad) {
      this.user.chat_status.chat_status = user.chat_status.chat_status;
      return false;
    }

    /* check if user exists */
    const actualUserIndex = this.chatUsers.findIndex(x => x.dni == user.dni);
    let reconnectedFromAfk: boolean = false;
    if (actualUserIndex !== -1 && this.chatUsers[actualUserIndex].chat_status.chat_status == "IDLE") {
      reconnectedFromAfk = true;
    }

    if (actualUserIndex !== -1) {
      this.chatUsers[actualUserIndex] = user;
    }
    else {
      this.chatUsers.push(user);
    }

    /* alert actual user if needed */
    this.sessionInfo.getUser().then(sessUser => {
      if (!this.firstChatLoad && sessUser.chat_notifications && !reconnectedFromAfk) {
        if (user.chat_status.chat_status == "ONLINE") {
          this.toastr.info(user.firstname + " " + user.lastname + " se ha conectado al chat.", "", {
            timeOut: 2000,
            tapToDismiss: true
          });
        }
        else if (user.chat_status.chat_status == "OFFLINE") {
          this.toastr.info(user.firstname + " " + user.lastname + " se ha desconectado del chat.", "", {
            timeOut: 2000,
            tapToDismiss: true
          });
        }
      }

      /* execute uri if it's callback */
      if (typeof uri == "function") {
        uri();
      }
    });

    /* Reorder array to see online first and that stuff */
    this.chatUsers.sort((u1: User, u2: User) => {
      switch (u1.chat_status.chat_status) {
        case "ONLINE":
          return -1;
        case "OFFLINE":
          return 1;
        case "IDLE":
          switch (u2.chat_status.chat_status) {
            case "ONLINE":
              return 1;
            case "OFFLINE":
              return -1;
            case "IDLE":
              return 0;
            default:
              return 1;
          }
        default:
          return 1;
      }
    });
  }


  /* Set user status when closing browser */
  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler($event) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST",environment.baseUrl + "rest/chat/user/offline",false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader(ApiOptions.headerName, ApiOptions.authScheme + this.sessMan.getToken());
    xhr.send();
  }

  ngOnInit() {
    this.refreshInactivity(null);
    this.setActive();
    this.ws.subscribe("scm/config_logo", this.onLogoChanged.bind(this));
    this.ws.subscribe("scm/chat_users", this.onChatUpdate.bind(this));

    /* Recargar estado del chat siempre que pase algo en los websockets */
    this.ws.onConnect(() => {
      this.loadChat();
    });
    this.ws.onDisconnect(() => {
      this.loadChat();
    });
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
