import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor( private usersServ: UsersService,
               private router: Router ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){

    if ( this.usersServ.userRole === 'ADMIN_ROLE'){
      return true;
    } else {

      Swal.fire('Admin','¡No está autorizado para realizar esta acción','warning');
      this.router.navigateByUrl('dashboard');
      return false;
    }
  }

}
