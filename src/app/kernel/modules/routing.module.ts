/* Angular */
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule, Router, NavigationEnd, NavigationStart, NavigationError} from '@angular/router';
import {Title} from '@angular/platform-browser';

/* Modules */
import {LoadingBarRouterModule} from '@ngx-loading-bar/router';
import {BrowserModule} from '@angular/platform-browser';
import {TranslateModule} from '@ngx-translate/core';

/* Services */
import {TranslateService} from '@ngx-translate/core';

/* Components */
import {FullRoutes} from '../config/routes.config';


@NgModule({
    imports: [
        BrowserModule,
        LoadingBarRouterModule,
        RouterModule.forRoot(FullRoutes),
        TranslateModule.forRoot(),
        FormsModule
    ],
    exports: [
        RouterModule
    ]
})
export class RoutingModule {
    constructor(private titleService: Title, router: Router, private translate: TranslateService) {
        router.events.subscribe(event => {
            if (event instanceof NavigationError) {
                router.navigate(['error']);
            }
            if (event instanceof NavigationEnd) {
                this.translate.get("page_titles").subscribe(
                    langLoaded => {
                        var pageTitle = this.translate.get("page_titles")["value"][router.url];
                        if(typeof pageTitle === "undefined")
                        {
                            pageTitle = this.translate.get("page_titles")["value"]["_notitle"];
                        }
                        this.titleService.setTitle(this.translate.get("page_titles")["value"]["_prefix"] + " " + pageTitle)
                    }
                );
            }
        });
    }
}