import { formatDate } from '@angular/common';
import { Subscription } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { MqttService, MqttConnectionState, IOnConnectEvent, IMqttMessage } from 'ngx-mqtt';
import { UserInterfaceService } from './user-interface.service';
import { environment } from 'src/environments/environment';
import { mqttMensaje } from '../interfaces/mensaje.interface';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {
  private stateConnSubs!:     Subscription;
  private observeConnSubs!:   Subscription;
  private observeTopicSubs!:  Subscription;
  private mqttErroCatcher!:   Subscription;

  public totalStoredMsg: number = 0;
  private storedMessages: mqttMensaje[] = [];
  private lastMessage!: mqttMensaje;
  private msjReceived!: mqttMensaje;


  constructor(private _mqttService: MqttService,
              private uiServ: UserInterfaceService,
              ) {

                this.getStoredMessage();
                this.lastMessage = new mqttMensaje('','ANDON','','','','','' , false, '',);
                this.msjReceived = new mqttMensaje('','ANDON','1','1','1','1','1' ,false, '1',);

              }

  subscribeAll(){

    this.observeConnSubs = this.observeConnection();
    this.observeTopicSubs = this.observeTopic();
    this.stateConnSubs = this.stateConnection();
    this.mqttErroCatcher = this.catchErrorMqtt();
  }

  unsubcribeAll(){

    this.observeConnSubs.unsubscribe();
    this.observeTopicSubs.unsubscribe();
    this.stateConnSubs.unsubscribe();
    this.mqttErroCatcher.unsubscribe();

  }

  catchErrorMqtt(){

    return this._mqttService.onError.subscribe({
      next: (observerOrNext: any)=>{
        console.log('se ejecutó onError:', observerOrNext);
      },
      error: ( err: any )=>{ console.log('onError Error:', err);
      },
      complete: ()=>{ console.log('onError Complete');
      }
    });

  }

  observeConnection(){

   return this._mqttService.onConnect.subscribe({
      next: (value: IOnConnectEvent) =>
        {
            this.sendStoredMsgs();
        }
    });
  }

  stateConnection(){

    return this._mqttService.state.subscribe({
      next: ( state: MqttConnectionState)=>{
        // console.log('state:', state);
        switch (state) {
          case 0:
            this.uiServ.uiStatus.statusConn = 'DISCONNECTED';
            this.uiServ.uiStatus.connected = false;
            break;
          case 1:
            this.uiServ.uiStatus.statusConn = 'CONNECTING'
            break;
          case 2:
            this.uiServ.uiStatus.statusConn = 'CONNECTED';
            this.uiServ.uiStatus.connected = true;
            break;
          default:
            break;
        }
      }
    });
  }

  observeTopic(){

    return this._mqttService.observe('welbit/data/crio/andon')
      .subscribe((message: IMqttMessage ) => {

        this.msjReceived= JSON.parse( message.payload.toString() );

      });
  }

  getStoredMessage(){

    const storedMsgString= localStorage.getItem('storedMsg') || '[]';
    this.storedMessages = JSON.parse( storedMsgString );
    this.totalStoredMsg = this.storedMessages.length;
  }

  storeMessage( message: mqttMensaje ){

    this.storedMessages.push( message );
    this.totalStoredMsg = this.storedMessages.length;
    localStorage.setItem('storedMsg', JSON.stringify( this.storedMessages));
  }

  getMsgStructure( station: string){

    const currentTimeInSeconds = Math.floor(Date.now()/1000);
    const currentDateTime = formatDate(Date.now(), 'yyyy/MM/dd hh:mm:ss a', 'en-MX');
    this.uiServ.uiBotonera.startTime = currentTimeInSeconds;

    const id = formatDate(Date.now(), 'yyyyMMddhhmmss.SSS', 'en-MX');

    const msgStructure: mqttMensaje = {
      Timestamp:  currentTimeInSeconds.toString(),
      Event_type:"ANDON",
      Datetime: currentDateTime,
      Station_ID: station,
      Elapsed:"0.000000",
      Source:"",
      ID: id
    };

    return msgStructure;
  }

  sendAndonMsg( event: string, station: string){

    const msgBasic = this.getMsgStructure( station );
    const messageJson = {
      State: event,
      isRealtime: this.uiServ.uiStatus.connected,
      ...msgBasic
    };

    if ( this.uiServ.uiStatus.connected ){ // si hay conexion con el server se envia (realtime true)

      this.publishMqttMessage( messageJson )

    }else { // si no hay conexion se envia al storage (realtime false)

      this.storeMessage( messageJson );
    }
  }

   publishMqttMessage( message: mqttMensaje ){

    const topic = environment.MQTT_TOPIC;

    this.uiServ.uiStatus.msgPublished = 'SENDING';
    this.lastMessage = message;
    console.log(message);

    const messageString = JSON.stringify( message );

      this._mqttService.publish(topic, messageString, {qos: 1, retain: true })
      .subscribe({
        next: (observer: any ) => {

          console.log('mensaje enviado');
          this.uiServ.uiStatus.msgPublished = 'CONFIRM';

        },
        error: (err: any) => {
          console.log('error al enviar:', err);

        },
        complete: ()=> {
          console.log('enviar msj: completado');

          if (this.lastMessage.ID === this.msjReceived.ID && this.uiServ.uiStatus.msgPublished != 'PUBLISHED'){
            this.uiServ.uiStatus.msgPublished = 'PUBLISHED';

          }

        }
      });

  }

  sendStoredMsgs(){

    const totalStoredMsgs = this.totalStoredMsg;

    if ( totalStoredMsgs > 0 ){

      const storedMsgs = this.storedMessages;
      this.storedMessages = [];
      this.totalStoredMsg = 0;
      localStorage.setItem('storedMsg','[]');

      let counter = 0;
      const total = storedMsgs.length;
        for (let message of storedMsgs ){

          counter++;
          message.isRealtime = (counter === total)? true : false;
          this.publishMqttMessage( message )
        }
    }
  }
}
