import {NgModule} from '@angular/core';
import {environment} from '../../../environments/environment';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {SessionSingleton} from "../singletons/session.singleton";
import {User} from "../model/user";
import {NgTranslatesService} from "../services/ng-translates.service";

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
  private setNavigatorLang() {
    const navLang = this.translate.getBrowserLang();
    if (-1 !== environment.availableLangs.findIndex(x => x == navLang)) {
      this.ngTranslateWrapper.setTranslate(this.translate.getBrowserLang());
    }
    else {
      this.ngTranslateWrapper.setOnlyDefaultLang(environment.availableLangs[0]);
    }
  }
  constructor(private translate: TranslateService, private session: SessionSingleton, private ngTranslateWrapper: NgTranslatesService) {
    /* Precargar idioma del navegador para evitar errores */
    translate.addLangs(environment.availableLangs);
    this.setNavigatorLang();

    /* Si esta conectado, darle el lenguaje de su perfil primero. */
    session.getUser().then((user: User) => {
      if (null !== user && (-1 !== environment.availableLangs.findIndex(x => x == user.lang_code))) {
        this.ngTranslateWrapper.setTranslate(user.lang_code);
      }
      else {
        this.setNavigatorLang();
      }
    });
  }
}
