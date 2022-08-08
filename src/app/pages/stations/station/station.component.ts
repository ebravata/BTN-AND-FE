import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { StationsService } from '../../../services/stations-service';
import { Station } from '../../../interfaces/station.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styles: [
  ]
})
export class StationComponent implements OnInit {
  public station!: Station;
  public stationForm!: FormGroup;
  public loading = true;
  public modifyStation = false;
  private sid!: string;

  constructor( private stationsServ: StationsService,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({ id }) => {

      this.sid = id;

      if ( this.sid !='nuevo'){
        this.getStation( id );
        this.modifyStation = true;
      }
      else
        this.newStation();
    })

    this.loadDataForm();
  }


  getStation( id: string ){

    this.stationsServ.getStation( id )
      .subscribe( ({ station }:any) => {
        this.station = station;
        this.loading = false;
        this.loadDataForm();
      })
  }

  newStation(){
    this.station = {
      sid: '',
      name: '',
      description: '',
      assigned: false,
      ip: '',
    }
    this.loadDataForm()
    this.loading = false;

  }

  loadDataForm(){

    if ( this.station ){

      this.stationForm = this.fb.group ({

        name:         [ this.station.name         || '', Validators.required ],
        description:  [ this.station.description  || '' ],
        assigned:     [ this.station.assigned     || false ],
        ip:           [ this.station.ip           || '' ]

      })
    }
  }

  releaseOrAssign( option: 'ASSIGN'| 'RELEASE'){

    const data = ({
      name:  this.station.name,
      description: this.station.description,
      assigned: !this.station.assigned,
      ip: ''
    })

      if ( option === 'ASSIGN'){
        this.stationsServ.assignStation( this.sid, data )
          .then(( station: any  )=> {

            this.station = station;
            this.loadDataForm();

          });
        }else{
        this.stationsServ.releaseStation( this.sid, data )
          .then(( station: any  )=> {

            this.station = station;
            this.loadDataForm();

          });
      }
  }

  save(){

    const data = this.stationForm.value;

    if (  this.sid != 'nuevo'){
      // update station

      this.stationsServ.updateStation( this.sid, data )
        .subscribe( resp => {

          Swal.fire('¡Estación actualizada!','Los datos se actualizaron correctamente','success');

          this.router.navigateByUrl('/dashboard/stations')

        })
    }else{
      // add new station

      this.stationsServ.createStation( data )
      .subscribe({
        next: ( resp ) => {

          Swal.fire('Estación Agregada!','Los datos se guardaron correctamente','success');

          this.router.navigateByUrl('/dashboard/stations');

        },

      })

    }

  }
}
