import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from '.././pages/dashboard/dashboard.component';
import { LoginComponent } from '.././pages/login/login.component';
import { LogoutComponent } from '.././pages/logout/logout.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { UsersComponent } from '.././pages/users/users.component';
import { UiStatusComponent } from '../components/ui-status/ui-status.component';
import { PagesComponent } from '.././pages/pages.component';
// import { StationAssignComponent } from '../components/admin/station-assign/station-assign.component';

import { AssigmentComponent } from '../components/admin/assigment/assigment.component';
import { NopageFoundComponent } from './nopage-found/nopage-found.component';
import { MainComponent } from './main/main.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserComponent } from './users/user/user.component';
import { StationsComponent } from './stations/stations.component';
import { StationComponent } from './stations/station/station.component';
import { RolePipe } from '../components/role.pipe';






@NgModule({
  declarations: [
    DashboardComponent,
    LoginComponent,
    LogoutComponent,
    UsersComponent,
    NavbarComponent,
    UiStatusComponent,
    PagesComponent,
    AssigmentComponent,
    NopageFoundComponent,
    MainComponent,
    UserComponent,
    StationsComponent,
    StationComponent,
    RolePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

  ],
  exports: [
    DashboardComponent,
    LoginComponent,
    LogoutComponent,
    UsersComponent,
    NavbarComponent,
    UiStatusComponent,
    PagesComponent,
    RolePipe
    // StationAssignComponent
  ],
  providers: [
      // {
      //   provide: HTTP_INTERCEPTORS,
      //   useClass: InterceptorService,
      //   multi: true
      // }
  ]
})
export class PagesModule { }
