import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DashboardComponent} from '../../components/dashboard.component';
import {ProfileComponent} from '../../components/profile.component';
import {UsersManageComponent} from '../../components/users/users.manage.component';
import {LogoutComponent} from '../../components/logout.component';
import {NavbarComponent} from '../../components/navbar.component';
import {ClientsTotalComponent} from '../../components/clients/clients.total.component';
import {ConfigComponent} from '../../components/config.component';
import {ClientsRoomComponent} from '../../components/clients/clients.room.component';
import {UsersTotalComponent} from '../../components/users/users.total.component';
import {UsersRoomComponent} from '../../components/users/users.room.component';
import {LanguageModule} from '../modules/language.module';
import {ChangeLanguageDirective} from '../directives/changelanguage.directive';
import {DefaultProfileImageDirective} from '../directives/defaultprofileimage.directive';
import {RouterModule} from '@angular/router';
import {TimeAgoPipe} from '../directives/time-ago.pipe';
import {SessionSingleton} from '../singletons/session.singleton';

import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';


import {
  MzButtonModule,
  MzInputModule,
  MzIconMdiModule,
  MzSidenavModule,
  MzCollapsibleModule,
  MzNavbarModule,
  MzProgressModule,
  MzCardModule,
  MzSelectModule,
  MzSwitchModule,
  MzModalModule,
  MzDropdownModule,
  MzValidationModule,
  MzCheckboxModule,
  MzTextareaModule
} from 'ng2-materialize';
import {ClientsConflictiveComponent} from "../../components/clients/clients.conflictive.component";
import {AgePipe} from "../directives/age.pipe";
import {RoomClientDataComponent} from "../../components/room/clients.data.component";
import {ConflictreasonsManageComponent} from "../../components/room/conflictreasons.manage.component";
import {ServerStatusComponent} from "../../components/server.status.component";
import {RatesManageComponent} from "../../components/room/rates.manage.component";
import { NgxUploaderModule } from 'ngx-uploader';

@NgModule({
  imports: [
    CommonModule,
    LanguageModule,
    RouterModule,
    NgxDatatableModule,
    NgxChartsModule,
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MzButtonModule,
    MzIconMdiModule,
    MzIconMdiModule,
    MzSidenavModule,
    MzInputModule,
    MzCollapsibleModule,
    MzNavbarModule,
    MzProgressModule,
    MzCardModule,
    MzSwitchModule,
    MzModalModule,
    MzDropdownModule,
    MzValidationModule,
    MzSelectModule,
    MzCheckboxModule,
    MzTextareaModule,
    NgxUploaderModule
  ],
  declarations: [
    NavbarComponent,
    DashboardComponent,
    UsersManageComponent,
    LogoutComponent,
    ProfileComponent,
    ClientsTotalComponent,
    ClientsRoomComponent,
    UsersTotalComponent,
    RoomClientDataComponent,
    ConflictreasonsManageComponent,
    UsersRoomComponent,
    ClientsConflictiveComponent,
    RatesManageComponent,
    ServerStatusComponent,
    ConfigComponent,
    ChangeLanguageDirective,
    DefaultProfileImageDirective,
    TimeAgoPipe,
    AgePipe
  ],
  exports: [
    ChangeLanguageDirective,
    DefaultProfileImageDirective
  ],
  providers: [SessionSingleton]
})

export class LoggedInModule {
}
