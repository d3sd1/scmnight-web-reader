import {Component, OnInit, ViewChild, ElementRef, ViewChildren, EventEmitter, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {User} from '../kernel/model/user';
import {NavbarOptions} from '../kernel/config/navbar.config';
import {MenuOption} from '../kernel/model/menu-option';
import {Router, NavigationEnd, Route} from '@angular/router';
import {MenuRoutes} from '../kernel/config/routes.menu.config';
import {MenuOptionData} from '../kernel/model/menu-option-data';
import {SessionSingleton} from '../kernel/singletons/session.singleton';
@Component({
    selector: 'main-content',
    templateUrl: '../templates/navbar.component.html'
})
export class NavbarComponent implements OnInit {
    constructor(private router: Router, private translate: TranslateService, private sessionInfo: SessionSingleton) {}
    filteredMenuOptions: MenuOption[] = [];
    menuLoaded: boolean = false;
    private user:User;
    ngOnInit() {
        this.sessionInfo.getUser().then(res => {
            this.user = res;
            this.constructMenu();
            this.pickActualMenuOption();
            this.menuOptionPicker();
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
            console.log("active " + menuOption.active );
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
            if (data.hidden !== true && data.validRanks.find(x => x === this.user.rank)) {
                const link = NavbarOptions.dashboardBase + "/" + route.path;
                var linkHref;
                let submenus = [];
                if (typeof route.children !== "undefined" && data.validRanks.find(x => x === this.user.rank)) {
                    route.children.forEach((subRoute: Route) => {
                        const subData = subRoute.data as MenuOptionData;
                        if (!subData.hidden && subData.validRanks.find(x => x === this.user.rank)) {
                            const subLink = link + "/" + subRoute.path;
                            submenus.push(new MenuOption(data.icon, (subData.isProfileText ? this.user.firstname + " " + this.user.lastname : this.translate.get("nav")["value"][subLink]), subLink));
                        }
                    });
                    linkHref = null;
                }
                else {
                    linkHref = link;
                }
                this.filteredMenuOptions.push(new MenuOption(data.icon, (data.isProfileText ? this.user.firstname + " " + this.user.lastname : this.translate.get("nav")["value"][link]), linkHref, submenus));
            }
        });
        this.menuLoaded = true;
    }
}