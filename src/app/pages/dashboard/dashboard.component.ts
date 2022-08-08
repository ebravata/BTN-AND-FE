import { Component, OnDestroy, OnInit } from '@angular/core';
import { IMqttMessage } from 'ngx-mqtt';
import { Subscription } from 'rxjs';

import { MensajesService } from 'src/app/services/mensajes.service';
import { UserInterfaceService } from 'src/app/services/user-interface.service';
import { StationsService } from '../../services/stations-service';

import { Station } from '../../interfaces/station.interface';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  private subscription!: Subscription;
  private subsTimer!: Subscription;
  public timer= '00:00:00';
  public statusTitle = '';
  public inactive = false;
  public station!: Station;
  public toggleBtns = {
    active: false,
    off: false,
    materials: false,
    maintenance: false,
    support: false
  }

  public activeBtn!: string;

  constructor(private msjServ: MensajesService,
              private uiServ: UserInterfaceService,
              private stationsServ: StationsService,
              private router: Router
              ) { }

  ngOnDestroy(): void {

    // this.subscription.unsubscribe();
    this.subsTimer.unsubscribe();

  }

  ngOnInit(): void {

    this.msjServ.subscribeAll();

    this.station = this.stationsServ.station || JSON.parse(localStorage.getItem('station') || '')
    this.setStatus ( this.uiServ.uiBotonera.inactive );
    this.statusTitle = this.uiServ.uiBotonera.stateTitle;
    this.activeBtn = localStorage.getItem('activeBtn' ) || 'ACTIVE';

    this.subsTimer = this.uiServ.watchTimer()
      .subscribe({
        next: ( data ) => {
          this.timer = data;
        }
      })
  }

  setStatus( status: boolean){
    this.inactive = status;
    this.uiServ.uiBotonera.inactive = status;
  }

  get activatedBtn(){
    const btn = localStorage.getItem('activeBtn' ) || 'ACTIVE';

    return btn;
  }


  createEvent( button: 'ACTIVE'| 'OFF'|'MATERIALS'|'MTTO'|'SUPPORT', reason:string ): string{

    this.activeBtn = button;
    localStorage.setItem('activeBtn', button );


    let event = button.concat(reason)
    const currentState = this.uiServ.uiBotonera.currentState;

    if ( currentState === 'ACTIVE'){

      event = event.concat('_ON');
      this.setStatus( true );

    }else{

      event = currentState.substring( 0, currentState.length - 3);
      event = event.concat('_OFF');
      this.setStatus( false );

    }

    return event;
  }

  getActive(){

    if (this.activeBtn==='ACTIVE') return;


    const offEvent = this.createEvent('ACTIVE', '')
    this.uiServ.saveState( 'ACTIVE', 'ACTIVE' );
    this.msjServ.sendAndonMsg( offEvent, this.station.name );
    this.setStatus( false );
    this.timer = '00:00:00';
    this.statusTitle = `ACTIVO`;

  }

  async getOff(){

    if (this.activeBtn==='OFF') return;

    const inputOptions =  {
          '_Meeting': 'Junta',
          '_Meal': 'Comida',
          '_Break': 'Break',
          '_Exit': 'Salida'
        };

    const { value: reason } = await Swal.fire({
      title: 'Seleeccione una razón',
      input: 'radio',
      showCancelButton: true,
      inputOptions: inputOptions,
      inputValidator: (value) => {

        return new Promise<string>((resolve) => {

          if (!value ) {
            resolve('¡Debe escoger una razon!')
          } else {
            resolve('');
          }
      })
      }

    })

    if (reason) {

      const offEvent = this.createEvent('OFF', reason)
      this.statusTitle = `APAGADO POR: ${ reason }`;
      this.uiServ.saveState( offEvent, this.statusTitle );
      this.msjServ.sendAndonMsg( offEvent, this.station.name );

    }
  }

  async materials(){

    if (this.activeBtn==='MATERIALS') return;

    const { value: text } = await Swal.fire({
      title: 'Capture el numero de parte del material',
      input: 'text',
      showCancelButton: true,
      inputLabel: 'Material',
      inputPlaceholder: 'Part Number',
      inputValidator: (value) => {

        return new Promise<string>((resolve) => {

          if (value.trim().length === 0 ) {
            resolve('¡Debe escribir un numero de parte válido!')
          } else {
            resolve('');
          }
      })
      }
    })

    if (text) {

      const offEvent = this.createEvent('MATERIALS', '')
      this.statusTitle = `MATERIALES: [${ text }]`;
      this.uiServ.saveState( offEvent, this.statusTitle );
      this.msjServ.sendAndonMsg( offEvent, this.station.name );

    }
  }

  async maintenance(){

    if (this.activeBtn==='MTTO') return;


    const inputOptions =  {
      '_Maintenance': 'Mantenimiento',
      '_Manufacture': 'Manufactura',
    };

  const { value: reason } = await Swal.fire({
    title: 'Seleeccione una razón',
    input: 'radio',
    showCancelButton: true,
    inputOptions: inputOptions,
    inputValidator: (value) => {

      return new Promise<string>((resolve) => {

        if (!value ) {
          resolve('¡Debe escoger una razon!')
        } else {
          resolve('');
        }
      });
    }

  })

  if (reason) {

      const offEvent = this.createEvent('MTTO', reason)
      this.statusTitle = `MANTENIMIENTO POR: ${ reason }`;
      this.uiServ.saveState( offEvent, this.statusTitle );
      this.msjServ.sendAndonMsg( offEvent, this.station.name );

    }
  }


  async support(){

    if (this.activeBtn==='SUPPORT') return;


    const inputOptions =  {
      '_Quality': 'Calidad',
      '_IT': 'IT',
      '_Safety': 'Seguridad',
    };

  const { value: reason } = await Swal.fire({
    title: 'Seleeccione una razón',
    input: 'radio',
    showCancelButton: true,
    inputOptions: inputOptions,
    inputValidator: (value) => {

      return new Promise<string>((resolve) => {

        if (!value ) {
          resolve('¡Debe escoger una razon!')
        } else {
          resolve('');
        }
      })
    }

  })

  if ( reason ) {

      const offEvent = this.createEvent('SUPPORT', reason);
      this.statusTitle = `SOPORTE TÉCNICO POR: ${ reason }`;
      this.uiServ.saveState( offEvent, this.statusTitle );
      this.msjServ.sendAndonMsg( offEvent, this.station.name );

    }

  }
}
