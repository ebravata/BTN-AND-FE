import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../../interfaces/user.interface';
import { UsersService } from '../../services/users.service';

declare const bootstrap: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [`
    .custom-tooltip {
    --bs-tooltip-bg: var(--bs-primary);
    } `]
})
export class UsersComponent implements OnInit {

  public total!: number;
  public users!: User[];
  public usersTemp!: User[];
  public desde: number = 0;
  public cargando: boolean = true;



  constructor( private router: Router,
               private usersServ: UsersService) { }


  ngOnInit(): void {

    this.getUsers();
    this.initToolTips()

  }

  initToolTips(){

    setTimeout(
      ()=>{
          const tooltipTriggerList: any = document.querySelectorAll('[data-bs-toggle="tooltip"]');
          const tooltipList = [...tooltipTriggerList].map( tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
      }, 1000); // retardo para que renderice el html completamente antes de inicializar los tooltips
  }

  getUsers(){

    this.usersServ.getUsers( this.desde )
        .subscribe({
          next: (data: any) =>{
            this.users = data.users;
            this.usersTemp = data.users;
            this.total = data.total;
            this.cargando = false;
          }
        })
  }

  // update( uid: string){

  //   // this.usersServ.u

  //   this.router.naviga

  // }

  search( key: string ){

    if ( key.length === 0 ){
      this.users = this.usersTemp;
      return;
    }

    this.usersServ.searchUser( key )
      .subscribe( (data: any) => {

        this.users = data.users;
        this.total = data.total;

      });
  }



  delete( user: User ){

    if (user.uid=== this.usersServ.activeUser.uid){
      Swal.fire('¡Aviso!','No se puede eliminar al usuario actual','info');
      return;
    }

    Swal.fire({
      title: 'Confirmacion',
      text: `¿Desea eliminar al usuario ${ user.name  }?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {

        // this.usersServ.deleteUser( '62b8b5f339fe25bd8515e83a' )
        this.usersServ.deleteUser( user.uid )
          .subscribe({
            next: ( resp: any ) => {

              this.getUsers();
              Swal.fire('¡Usuario Eliminado!', resp.msg, 'success' );

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

    this.getUsers();
  }

  logout(){
    this.router.navigateByUrl('/logout')
  }
}
