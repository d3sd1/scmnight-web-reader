// NG-MODULES
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

// MODULES

// COMPONENTS
import {LoginComponent} from '../../components/login.component';
import {RecoverComponent} from '../../components/recover.component';
import {RecoverCodeComponent} from '../../components/recover.code.component';
import {LanguageModule} from '../modules/language.module';
import {
  MzButtonModule,
  MzInputModule,
  MzIconMdiModule,
  MzSidenavModule,
  MzCheckboxModule,
  MzRadioButtonModule,
  MzSwitchModule
} from 'ngx-materialize';
import {NgTranslatesService} from "../services/ng-translates.service";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LanguageModule,
        RouterModule,
        MzButtonModule,
        MzIconMdiModule,
        MzSidenavModule,
        MzInputModule,
        MzCheckboxModule,
      MzSwitchModule,
      MzRadioButtonModule
    ],
    declarations: [
        LoginComponent,
        RecoverComponent,
        RecoverCodeComponent
    ],
  providers: [
    NgTranslatesService
  ]
})

export class LoggedOutModule {}
