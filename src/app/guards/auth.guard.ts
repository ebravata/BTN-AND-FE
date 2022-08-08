import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { UsersService } from '../services/users.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor( private usersServ: UsersService,
               private router: Router){

  }

  canLoad(
    route: Route,
    segments: UrlSegment[]){

      return this.usersServ.validateToken()
        .pipe(
          tap( isAuthenticated => {

            if ( !isAuthenticated ){

              console.log('canLoad');
              Swal.fire('Admin','Su sesión expiró, vuelva iniciar sesión','info');

              this.router.navigateByUrl('/login');

            }
          })
        )
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){

      return this.usersServ.validateToken()
        .pipe(
          tap( isAuthenticated => {

            if ( !isAuthenticated ){

              console.log('canActivate');
              Swal.fire('Admin','Su sesión expiró, vuelva iniciar sesión','info');

              this.router.navigateByUrl('/login');

            }
          })
        )
  }
}
