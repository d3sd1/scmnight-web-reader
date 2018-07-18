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
import {MzModalComponent} from "ng2-materialize";

@Component({
  selector: 'main-content',
  templateUrl: '../templates/navbar.component.html'
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router, private translate: TranslateService, private sessionInfo: SessionSingleton) {
  }
  public modalOptions: Materialize.ModalOptions = {
    dismissible: false, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '100%', // Starting top style attribute
    endingTop: '10%'
  };
  @ViewChild('changeLogoModal') changeLogoModal: MzModalComponent;

  filteredMenuOptions: MenuOption[] = [];
  menuLoaded: boolean = false;
  private user: User;
  private userPermission: Array<Permission>;

  changeLogo() {
    this.changeLogoModal.open();
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
