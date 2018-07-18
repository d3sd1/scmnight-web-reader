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
import {MzButtonModule, MzInputModule, MzIconMdiModule, MzSidenavModule, MzCheckboxModule, MzRadioButtonModule} from 'ngx-materialize';


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
        MzRadioButtonModule
    ],
    declarations: [
        LoginComponent,
        RecoverComponent,
        RecoverCodeComponent
    ]
})

export class LoggedOutModule {}
