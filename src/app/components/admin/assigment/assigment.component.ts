import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Station } from 'src/app/interfaces/station.interface';
import { StationsService } from 'src/app/services/stations-service';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assigment',
  templateUrl: './assigment.component.html',
  styles: [
  ]
})
export class AssigmentComponent implements OnInit {

  public assigned = false;
  public adminRole = false;
  public stationsAvailables: Station[] = [];
  private localIp = '';
  public stationSelected = 'NO_STATION'

  @ViewChild('station') station!: ElementRef;

  constructor( private stationsServ: StationsService,
               private usersServ: UsersService,
               private router: Router) { }

  ngOnInit(): void {

    this.localIp = this.stationsServ.localIp;
    this.adminRole = (this.usersServ.userRole === 'ADMIN_ROLE')? true : false ;

    this.getStationsAvaliables();

  }

  getStationsAvaliables(){

    if ( this.adminRole ){

      this.stationsServ.getAvailableStations()
        .subscribe( (stations: Station[]) =>{

          this.stationsAvailables = stations;

        })
    }
  }


  assign( stationForm: NgForm){

    // const stationId =  stationForm.controls['station'].value ;
    const stationId =  this.stationSelected;
    const stationSel = this.station.nativeElement;
    const nombreStation = stationSel.options[stationSel.selectedIndex].text;


    if ( stationId==='NO_STATION' || stationId === ''){
      Swal.fire('¡Aviso!','Seleccione una estación válida','warning')
      return;
    }

      Swal.fire({
        title: 'Info',
        text: `¿Desea asignar la estacion ${ nombreStation } a este dispositivo [${ this.localIp }]?`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, asignar!'
      }).then((result) => {
        if (result.isConfirmed) {

          const name = nombreStation;
          const ip = this.localIp;
          const dataStation = {
            name,
            ip,
            assigned: true
          };

          this.stationsServ.updateStation( stationId, dataStation )
          .subscribe({
            next:  ( resp) => {

              Swal.fire('Dispositivo Asignado!','La estacion ha sido asignada correctamente, vuelva a iniciar sesion para acceder al dashboard','success');
              this.router.navigateByUrl('/login');

            },
            error: ( err ) => {

              Swal.fire('¡Error!', err.error.msg ,'error');

            }
          })
        }
      })
  }

  logout(){
    this.usersServ.logout();
    this.router.navigateByUrl('/login');
  }

}
