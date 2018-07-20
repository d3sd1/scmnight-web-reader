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
        let pageTitle = "";
        this.translate.get("page_titles." + router.url).subscribe(getPageTitle => {
            if (getPageTitle.indexOf("page_titles.") !== -1) {
              this.translate.get("page_titles._notitle").subscribe(noTitle => {
                pageTitle = noTitle;
              });
            }
            else {
              pageTitle = getPageTitle;
            }
            this.translate.get("page_titles._prefix").subscribe(prefix => {
              this.titleService.setTitle(prefix + " " + pageTitle)
            });
          }, (err) => {
            console.error("SCM MENU CRASH: " , err);
          }
        );
      }
    });
  }
}
