import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor() { }

  get token(): string {
    return localStorage.getItem('btn-token') || '';
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable <HttpEvent<any>> {

    // console.log('Pasó por el interceptor');

    const url_api = environment.URL_API;

    const exclutionListUrl = [
      'https://api.ipify.org/?format=json',
      `${ url_api }/login/confirm`
    ]

    if ( exclutionListUrl.includes( req.url )){

      return next.handle( req );

    }else{

      const headers = new HttpHeaders({
        'btn-token': this.token
      });

      const reqClone = req.clone({
        headers
      })

      return next.handle( reqClone ).pipe(
        catchError( this.manejaError  )
      );
    }
  }

  manejaError( err: HttpErrorResponse ){

      const errores = err.error.msg;

        let msg = '';

        if ( ( typeof errores ) === 'string' )
          msg = errores;
        else{
          for ( let clave in errores )
          msg += errores[clave].msg + '<br>';
        }

        Swal.fire('¡Error!', msg, 'error')

    return throwError( ()=> err )
  }
}
