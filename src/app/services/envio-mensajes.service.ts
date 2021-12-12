import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvioMensajesService {

  constructor( private http: HttpClient) { 
    console.log('servicio inicializado')
  }


  mqttPub( boton: string ){
    console.log(boton);

   let payload: any  = {
      "estacion": "OP220",
      "linea": "L2",
      "msj": boton
    }

    this.http.post('http://localhost:3005/mqtt', payload).subscribe( resp => console.log( resp ) );


  }
}
