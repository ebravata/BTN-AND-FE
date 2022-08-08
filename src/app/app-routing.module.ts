import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { VerifyDeviceComponent } from './components/admin/verify-device/verify-device.component';
import { AssigmentComponent } from './components/admin/assigment/assigment.component';
import { PagesRoutingModule } from './pages/pages-routing.module';
import { NopageFoundComponent } from './pages/nopage-found/nopage-found.component';


const routes: Routes = [

  { path: 'login',      component: LoginComponent },
  { path: 'logout',     component: LogoutComponent  },
  { path: 'verify',     component: VerifyDeviceComponent },
  { path: 'assigment',  component: AssigmentComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NopageFoundComponent }
]

@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forRoot( routes ),
    PagesRoutingModule

  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
