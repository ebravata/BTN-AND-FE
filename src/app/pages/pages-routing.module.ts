import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { UsersComponent } from './users/users.component';
import { MainComponent } from './main/main.component';
import { UserComponent } from './users/user/user.component';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { StationsComponent } from './stations/stations.component';
import { StationComponent } from './stations/station/station.component';


const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    canLoad: [AuthGuard],
    canActivate:[ AuthGuard ],
    children:
      [
      { path: 'main',       component: MainComponent, canLoad: [AuthGuard], canActivate:[ AuthGuard ] },
      { path: 'users',      component: UsersComponent, canLoad: [AuthGuard], canActivate:[ AuthGuard ] },
      { path: 'user/:id',      component: UserComponent, canLoad: [AuthGuard], canActivate:[ AuthGuard ] },
      { path: 'stations',      component: StationsComponent, canLoad: [AuthGuard], canActivate:[ AuthGuard ] },
      { path: 'station/:id',      component: StationComponent, canLoad: [AuthGuard], canActivate:[ AuthGuard ] },
      { path: '', component: MainComponent }
      ]
  }]


@NgModule({
  declarations: [],
  imports: [ RouterModule.forChild( routes )],
  exports: [ RouterModule ]
})
export class PagesRoutingModule { }
