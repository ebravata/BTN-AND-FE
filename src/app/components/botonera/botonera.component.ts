import { Component, OnInit } from '@angular/core';
import { EnvioMensajesService } from 'src/app/services/envio-mensajes.service';
import { PingMonitorService } from 'src/app/services/ping-monitor.service';

@Component({
  selector: 'app-botonera',
  templateUrl: './botonera.component.html',
  styles: [
  ]
})
export class BotoneraComponent implements OnInit {

  constructor( private envioMsj: EnvioMensajesService,
               private pingMon: PingMonitorService) { }

  enviarMsj( boton: string  ){

    this.envioMsj.mqttPub( boton );

  }

  ngOnInit(): void {

    this.pingMon.enviarPing;
    // this.pingMon.retornaMonitor().subscribe(resp => console.log( resp ) );
    // .pipe(first())
    // .subscribe(resp => {
    //   if (resp.status === 200 ) {
    //     console.log(true)
    //   } else {
    //     console.log(false)
    //   }
    // }, err => console.log(err));
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this.pingMon.retornaMonitor();
  }

}
