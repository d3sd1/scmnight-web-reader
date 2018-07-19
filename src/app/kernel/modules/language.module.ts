import {NgModule} from '@angular/core';
import {environment} from '../../../environments/environment';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';

@NgModule({
  imports: [TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: function (http: HttpClient) {
        return new TranslateHttpLoader(http, "./langs/", ".json");
      },
      deps: [HttpClient]
    }
  })],
  exports: [TranslateModule]
})

export class LanguageModule {
  constructor(translate: TranslateService) {
    const userLang = navigator.language;
    if (userLang in environment.availableLangs) {
      translate.setDefaultLang(userLang);
    }
    else {
      translate.setDefaultLang(environment.availableLangs[0]);
    }
    translate.addLangs(environment.availableLangs);
    if (environment.availableLangs.indexOf(translate.getBrowserLang()) != -1) {
      translate.use(translate.getBrowserLang());
    }
  }
}
