import { Component, OnInit } from '@angular/core';
import { MensajesService } from 'src/app/services/mensajes.service';
import { UserInterfaceService } from 'src/app/services/user-interface.service';

@Component({
  selector: 'app-ui-status',
  templateUrl: './ui-status.component.html',
  styles: [
  ]
})
export class UiStatusComponent implements OnInit {

  constructor(public uiServ: UserInterfaceService,
              public msjsServ: MensajesService
              ) { }

  ngOnInit(): void {
  }

}
