import { Component, OnInit } from '@angular/core';
import { StationsService } from '../../../services/stations-service';
import { Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-verify-device',
  templateUrl: './verify-device.component.html',
  styles: [
  ]
})
export class VerifyDeviceComponent implements OnInit {
  public localIP = '';


  constructor( private stationsServ: StationsService,
               private usersServ: UsersService,
               private router: Router) { }

  ngOnInit(): void {

    // this.delay2();
    this.checkAssigment();
    this.localIP = this.stationsServ.localIp
    // this.usersServ.
  }


  checkAssigment(){

    setTimeout( ()=>{

      this.stationsServ.checkAssigment( this.localIP )
         .subscribe( (assigned: boolean) => {

           if ( assigned ){
             this.router.navigateByUrl('/dashboard')
           }else{
             this.router.navigateByUrl('/assigment')
           }
         });

    }, 1500) // retardo de 1.5 s para crear impresion de loading
   }

}
