import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { IUiStatus } from '../interfaces/uiStatus.interface';
import { IUiBotonera } from '../interfaces/uiBotonera.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserInterfaceService implements  OnDestroy {

  private intervalo: any;
  public uiStatus!: IUiStatus;
  public uiBotonera!: IUiBotonera;

  constructor( private http: HttpClient ) {

    this.uiBotonera= {
      currentState: '',
      stateTitle: '',
      inactive: false,
      startTime:  0
    };

    this.uiStatus = {
      connected: false,
      statusConn: '',
      msgPublished: 'PUBLISHED',
      storedMessages: 0
    }

    this.uiBotonera.currentState = localStorage.getItem ('currentState') || 'ACTIVE';
    this.uiBotonera.stateTitle = localStorage.getItem ('stateTitle') || '';
    this.uiBotonera.startTime = Number(localStorage.getItem ('startTime') || '0');

    if ( this.uiBotonera.currentState === 'ACTIVE')
      this.uiBotonera.inactive = false;
    else
      this.uiBotonera.inactive = true;

  }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    clearInterval( this.intervalo ); // se detiene el interval con el nombre de la constante
  }

  saveState( state: string, stateTitle: string ){

    localStorage.setItem('currentState', state);
    localStorage.setItem('startTime', this.uiBotonera.startTime.toString());
    localStorage.setItem('stateTitle', stateTitle)
    this.uiBotonera.currentState = state;
  }

  watchTimer(): Observable <string>{

    const obs$ = new Observable <string> ( observer => {
      let elapsedTime: number;
      let currentTime: number;
      let elapsedTimeString: string;

      this.intervalo = setInterval( () => { // se le pone nombre al Interval para hacer referencia en el codigo (poder detenerlo)

        if ( this.uiBotonera.inactive ){

          currentTime = Math.floor(Date.now()/1000);
          elapsedTime = currentTime  - this.uiBotonera.startTime;
          elapsedTimeString = '';

          const horas = Math.trunc( elapsedTime / 3600 );
          const resHoras = elapsedTime % 3600;
          const minutos = Math.trunc( resHoras / 60 );
          const segundos = resHoras % 60;


          elapsedTimeString = (String(horas)).padStart(2, "0")+":"+(String(minutos)).padStart(2, "0") +":"+ (String(segundos)).padStart(2, "0");
          observer.next( elapsedTimeString );

          // observer.complete();
        }

      }, 1000);

    } );

    return obs$;

   }
}
