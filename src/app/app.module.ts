import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';


import { PagesModule } from './pages/pages.module';
import { InterceptorService } from './interceptor/interceptor.service';

const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = environment.MQTT_SERVICE_OPTIONS;


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    PagesModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    AppRoutingModule
  ],
   providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  // aWebSocket.onerror = function(event) {
  //   console.error("Error en el WebSocket detectado:", event);

  // };
}
