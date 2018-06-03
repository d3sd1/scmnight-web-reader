import {Directive, HostListener, ElementRef} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NotificationsService} from 'angular2-notifications';
import {ApiService} from '../services/api.service';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {Router, NavigationEnd} from '@angular/router';

@Directive({
    selector: '[changeMenuLanguage]'
})
export class ChangeLanguageDirective {

    constructor(public el: ElementRef,
        private api: ApiService,
        private notify: NotificationsService,
        private loadingBar: LoadingBarService,
        private translate: TranslateService) {}
    @HostListener('click') onClick() {
        this.changeUserPreferences();
    }
    changeUserPreferences() {
        let lang = $(this.el.nativeElement).attr("data-menulang");
        this.loadingBar.start();
        this.api.post("session/userlang", {"langcode": lang})
            .finally(() => {
                this.loadingBar.complete();
            })
            .subscribe(
            (data: any) => {
                this.translate.get("notifications").subscribe(langLoaded =>
                    this.notify.success(
                        this.translate.get("notifications")["value"]["lang_changed"]["success"]["title"],
                        this.translate.get("notifications")["value"]["lang_changed"]["success"]["desc"],
                        {
                            preventDuplicates: false
                        }
                    )
                );
                this.translate.use(lang);
                this.langMenuActive($(this.el.nativeElement).attr("data-menulang"));
            },
            (error: object) => {
                this.translate.get("notifications").subscribe(langLoaded =>
                    this.notify.error(
                        this.translate.get("notifications")["value"]["lang_changed"]["error"]["title"],
                        this.translate.get("notifications")["value"]["lang_changed"]["error"]["desc"],
                        {
                            preventDuplicates: false
                        }
                    )
                );
            }
            );
    }
    langMenuActive(activeLang:String) {
        let menuLangs = $(this.el.nativeElement).parent("ul").children("li");
        menuLangs.each(function (index,lang) {
            if (typeof menuLangs[index].classList != "undefined") {
                menuLangs[index].classList.remove('lang-selected');
                if (menuLangs[index].getAttribute("data-menulang") == activeLang) {
                    menuLangs[index].classList.add('lang-selected');
                }
            }
        });

    }
    public init(lang:string)
    {
        this.langMenuActive(lang);
    }
}