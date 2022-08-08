import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Station } from '../interfaces/station.interface';
import { map, catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { resolve } from 'dns';

const URL_API = environment.URL_API;

@Injectable({
  providedIn: 'root'
})
export class StationsService {

  public localIp = '';
  public station!: Station;

  constructor( private http: HttpClient) {

   }

   getClientIp(){

    return  this.http.get('https://api.ipify.org/?format=json')
             .pipe(
               map( (resp: any) => {
                this.localIp = resp.ip;

              })
             );
  }

  getStation( id: string){

    const url = `${ URL_API }/stations/${ id }`;

    return this.http.get<Station>( url );
  }

  getStations( desde: number){

    const url = `${ URL_API }/stations?desde=${ desde }`;

    return this.http.get<Station[]>( url );
  }

  searchStations( key: string ){

    const url = `${ URL_API }/stations/search/${ key }`;

    return this.http.get<Station[]>( url )
    .pipe(
      map( (resp: any ) => resp.stations)
    )
  }

  getAvailableStations(){

    const url = `${ URL_API }/stations/availables`;

    return this.http.get<Station[]>( url )
        .pipe(
          map( (resp: any ) => resp.stations)
        )
  }

  checkAssigment( ip: string ){

    const url = `${ URL_API }/stations/stcheck`;

    return this.http.post( url, { ip })
        .pipe(
          map( (resp:any) => {

            this.station = resp.station;
            localStorage.setItem('station', JSON.stringify( this.station ))
            return true;

          }),
          catchError( err => of( false ))
        )
  }

  createStation( data: { name: string , description: string, assigned: boolean, ip: '' } ){

    const url = `${ URL_API }/stations`;

    return this.http.post( url, data );
  }

  updateStation( id:string, data: { name: string , ip: string, assigned: boolean} ){

    const url = `${ URL_API }/stations/${ id }`;

    return this.http.put( url, data );
  }

  deleteStation( id: string ){

    const url = `${ URL_API }/stations/${ id }`;

    return this.http.delete( url );
  }


  releaseStation( id: string, data: any ){

    return new Promise( resolve =>{

      Swal.fire({
        title: '¡Confirmacion!',
        text: "¿En realidad desea liberar la estación?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Liberar'
      }).then((result) => {
        if (result.isConfirmed) {

          this.updateStation( id, data )
            .subscribe( (resp: any) => {

              resolve( resp.station );

              Swal.fire(
                '¡Estación liberada!',
                'La estación se liberó correctamente',
                'success'
              );
            })
        }
      })
    });

  }

  assignStation ( id: string, data: any ) {

    return new Promise ( resolve =>{

      Swal.fire({
        title: 'Ingrese una IP válida',
        input: 'text',
        inputLabel: 'Your IP address',
        inputValue: '',
        showCancelButton: true,
        inputValidator: (value) => {
          return new Promise((resolve) => {
              if (value.trim() != '' && this.isValidIp( value ) ) {
                  resolve('');
              } else {
                  resolve('Ingrese una Ip válida!')
              }
          });
          }
      }).then( ({isConfirmed, value }) => {

        if (isConfirmed) {

          if ( value.trim()!=''){

            data.ip = value;
            data.assigned = true;

            this.updateStation( id, data )
              .subscribe( (resp:any) =>{

                // console.log(resp);
                resolve( resp.station )

                Swal.fire(
                  '¡Estación Asignada!',
                  'La estación se asignó correctamente',
                  'success'
                );
              })
          }else{

            Swal.fire('¡Error!','Introduzca una IP válida','error');
          }
        }

      })

    });
  }

  isValidIp( ip: string ){

      let segment = ip.split('.');

      if ( segment.length != 4 )
        return false;

        for ( let i in segment){

          if(
            !/^\d+$/g.test(segment[i])
            ||+segment[i]>255
            ||+segment[i]<0
            ||/^[0][0-9]{1,2}/.test(segment[i])
            )
              return false;

          }
      return true
  }
}
