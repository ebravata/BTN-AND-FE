import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/user.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { StationsService } from './stations-service';
import { Router } from '@angular/router';
import { MensajesService } from './mensajes.service';
import { UsersComponent } from '../pages/users/users.component';

const url_api = environment.URL_API;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public activeUser!: User;

  constructor( private http: HttpClient,
               private stationsServ: StationsService,
               private msgServ: MensajesService,
               private router: Router) { }


  // url users: /api/users

  get userRole(): 'ADMIN_ROLE' | 'USER_ROLE'{
    return this.activeUser.role;
  }

  get token(): string {
    return localStorage.getItem('btn-token') || '';
  }

  getUsers( desde: number ){
    const url = `${ url_api }/users?desde=${ desde }`;

    return this.http.get( url );
  }

  getUser( id: string ){
    const url = `${ url_api }/users/${ id }`;

    return this.http.get( url );
  }

  updateUser( user: User ){

    const url = `${ url_api }/users/${ user.uid }`;

    return this.http.put( url, user);

  }

  updatePass( user: User ){

    const url = `${ url_api }/users/password/${ user.uid }`;

    return this.http.put( url, user);

  }

  searchUser( key: string ){

    const url = `${ url_api }/users/search/${ key }`;

    return this.http.get( url );

  }

  createUser( user: User ){

    const url = `${ url_api }/users`;

    return this.http.post( url, user);
  }

  deleteUser( id: string ){

    const url = `${ url_api }/users/${ id }`;

    return this.http.delete( url );

  }

  loginUser( email: string, password: string ){

    const url = `${ url_api }/login`;

    return this.http.post( url, { email, password })
            .pipe(
              map( ( data: any )  => {

                this.activeUser = data.user;
                localStorage.setItem('btn-token', data.token);
                return data.ok ;

              })
            );
  }

  confirmPassword( email: string, password: string ){

    const url = `${ url_api }/login/confirm`;
    const headers = new HttpHeaders({
      'btn-token': this.token
    });
    return this.http.post( url, { email, password }, { headers });

  }

  validateToken(): Observable<boolean>{

    return this.http.get(`${ url_api }/login/renew`)
    .pipe(
      map( (resp: any) => {

        const{ nombre, email, department, role, uid  } = resp.user;

        // // se guarda el usuario en este servicio como una propiedad publica para cargar los datos durante toda la sesion
        // this.usuario = new User(nombre, email, department role, uid );
        this.activeUser = resp.user;
        localStorage.setItem('btn-token', resp.token);


        return true;
      }),
      catchError( error => of( false ))
    );
  }


  logout(){

    this.stationsServ.station = {
      sid: '',
      name: '',
      description: '',
      assigned: false,
      ip: ''
    }

    localStorage.removeItem('btn-token');
    localStorage.removeItem('station');
    this.router.navigateByUrl('/login');
    this.msgServ.unsubcribeAll();

  }
}
