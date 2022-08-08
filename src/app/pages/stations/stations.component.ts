import { Component, OnInit } from '@angular/core';
import { Station } from '../../interfaces/station.interface';
import { StationsService } from '../../services/stations-service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

declare const bootstrap: any;

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styles: [
  ]
})
export class StationsComponent implements OnInit {

  public total!: number;
  public stations!: Station[];
  public stationsTemp!: Station[];
  public desde: number = 0;
  public cargando: boolean = true;

  constructor( private stationsServ: StationsService) { }

  ngOnInit(): void {

    this.getStations()
    this.initToolTips();
  }

  initToolTips(){

    setTimeout(
      ()=>{
          const tooltipTriggerList: any = document.querySelectorAll('[data-bs-toggle="tooltip"]');
          const tooltipList = [...tooltipTriggerList].map( tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
      }, 1000); // retardo para que renderice el html completamente antes de inicializar los tooltips
  }


  getStations(){

    this.stationsServ.getStations( this.desde )
      .subscribe({
        next: ( ( resp: any ) => {
          // console.log(resp);
          this.stations = resp.stations;
          this.stationsTemp = resp.stations;
          this.cargando = false;
          this.total = resp.total;


        })
      })

  }


  searchStation( key: string ){

    if ( key.length === 0 ){

      this.stations = this.stationsTemp;
      return;
    }

    this.stationsServ.searchStations( key )
      .subscribe( stations =>{

        this.stations = stations;

      });
  }

  delete( station: Station ){

    Swal.fire({
      title: 'Confirmacion',
      text: `¿Desea eliminar la estación ${ station.name  }?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {

    // this.usersServ.deleteStation( '62b8b5f339fe25bd8515e83a' )
    this.stationsServ.deleteStation( station.sid )
          .subscribe({
            next: ( resp: any ) => {

              this.getStations();
              Swal.fire('Estación Eliminada!', resp.msg, 'success' );

            }
          });
      }
    })


  }


  cambiarPagina( valor: number ){
    this.desde += valor;

    if ( this.desde <= 0 ){
      this.desde = 0;
    }else if ( this.desde > this.total ){
      this.desde = this.total;
    }

    this.getStations();
  }

  releaseOrAssign( option: 'ASSIGN'| 'RELEASE', station: Station){

    const data = ({
      name:  station.name,
      description: station.description,
      assigned: !station.assigned,
      ip: ''
    })

      if ( option === 'ASSIGN'){
        this.stationsServ.assignStation( station.sid, data )
          .then(( station: any  )=> {

            // this.station = station;
            // this.loadDataForm();
            this.getStations();

          });
        }else{
        this.stationsServ.releaseStation( station.sid, data )
          .then(( station: any  )=> {

            // this.station = station;
            // this.loadDataForm();
            this.getStations();

          });
      }
  }
}
