import {Component, OnInit, ViewChild, ElementRef, ViewChildren, EventEmitter, Output} from '@angular/core';
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

import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import {NotificationsService} from "angular2-notifications";
@Component({
  selector: 'main-content',
  templateUrl: '../templates/navbar.component.html'
})
export class NavbarComponent implements OnInit {

  options: UploaderOptions;
  uploadInput: EventEmitter<UploadInput>;
  uploadingLogo = false;
  base64CustomImage = "data:image/png;base64,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";
   @ViewChild('changeLogoModal') changeLogoModal: MzModalComponent;

  cancelUpload() {
    if(!this.uploadingLogo)
    {
      this.changeLogoModal.closeModal();
    }
    else
    {
      this.notify.success(
        "",
        this.translate.get("logo_upload.error_uploading")["value"]
      );
    }
    this.uploadingLogo = false;
  }
  logoUpload($event) {
    this.uploadingLogo = true;
    console.log("add");
    var reader = new FileReader();
    reader.readAsDataURL($event.target.files[0]);
    reader.onload = function () {
      //TODO: subir logo
      console.log("base 64: ", reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  // END TEST UPLOAD
  constructor(private router: Router, private translate: TranslateService, private sessionInfo: SessionSingleton, private notify: NotificationsService) {
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
  private user: User;
  private userPermission: Array<Permission>;

  changeLogo() {
    this.changeLogoModal.openModal();
  }
  ngOnInit() {
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
              submenus.push(new MenuOption(data.icon, (subData.isProfileText ? this.user.firstname + " " + this.user.lastname : this.translate.get("nav")["value"][subLink]), subLink));
              submenusHasPermissions = true;
            }
          });
          linkHref = null;
        }
        else {
          linkHref = link;
        }
        if (this.userPermission.find(x => x.action === data.requiredPermission) && typeof route.children === "undefined" || submenusHasPermissions) {
          this.filteredMenuOptions.push(new MenuOption(data.icon, (data.isProfileText ? this.user.firstname + " " + this.user.lastname : this.translate.get("nav")["value"][link]), linkHref, submenus));
        }
      }
    });
    this.menuLoaded = true;
  }
}
