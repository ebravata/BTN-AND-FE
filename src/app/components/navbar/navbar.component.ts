import { Component, NgZone, OnInit } from '@angular/core';

import { UsersService } from '../../services/users.service';

import { User } from '../../interfaces/user.interface';
import { Station } from '../../interfaces/station.interface';
import { StationsService } from '../../services/stations-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit {

  public user_role = '';
  public activeUser!: User;
  public station!: Station;
  private validPass = false;


  constructor( private usersServ: UsersService,
               private stationsServ: StationsService,
               private router: Router,
               private ngZone: NgZone) { }

  ngOnInit(): void {

      this.activeUser = this.usersServ.activeUser || JSON.parse(localStorage.getItem('activeUser') || '')

    this.user_role = ( this.activeUser.role === 'ADMIN_ROLE' )? 'Admin' : 'User'
  }

  logout(){
    console.log('logout');
    this.usersServ.logout();
    // this.router.navigateByUrl('logout')
  }

  async changePassword(){

    const { value: formValues } = await Swal.fire({
      title: 'Multiple inputs',
      html:
        `
        <label for="currentPass" class="form-label text-center">Current Password</label>
        <input type="password" id="currentPass" class="form-control">
        <label for="newPass" class="form-label text-center">New Password</label>
        <input type="password" id="newPass" class="form-control">
        <label for="newPass" class="form-label">Confirm Password</label>
        <input type="password" id="confirmPass" class="form-control">
        <br>
        <div id="alert" class="alert alert-danger" role="alert" hidden>
        </div>
        `,
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: async () => {

        const currentPass = (<HTMLInputElement>document.getElementById('currentPass')).value;
        const newPass = (<HTMLInputElement>document.getElementById('newPass')).value;
        const confirmPass = (<HTMLInputElement>document.getElementById('confirmPass')).value;

        if ( currentPass.trim()==='' || newPass.trim()==='' || confirmPass.trim()===''){
          this.alert('¡No ser permiten contraseñas en blanco!')
          return false;
        }


        if ( newPass != confirmPass ){
          this.alert('Las contraseñas ingresadas no coinciden')
          return false;
        }

        // confirma pasword actual
        const email = this.usersServ.activeUser.email;

        // this.ngZone.run( () => {
        // let algo = false;
        const confirmOk = await this.confirmPass( email, currentPass )
          .then( resp=> {
            console.log(resp)
            return true;
          })
          .catch( err => {
            console.log(err)
            return false;
          })


          if ( !confirmOk ){
            this.alert('Su contraseña actual es incorrecta')
            return false;
          }

        this.updatePasword( newPass );
        return  true;
      }
    })
  }

  alert( message: string ){
    const divAlert = <HTMLInputElement>document.getElementById('alert');
    divAlert.hidden = false;
    divAlert.textContent = message;
  }

  confirmPass( email: string, currentPass: string ){

    let result = new Promise ((resolve, reject)=>{
      this.usersServ.confirmPassword( email, currentPass )
            .subscribe({
              next: ( resp ) =>{
                // console.log(resp);
                resolve( true );
              },
              error: ( error ) =>{
                // console.log(error);
                reject(false);
              }
            })
          })
    return result;
  }

  updatePasword( pass: string ){
    const user = this.usersServ.activeUser;
    user.password = pass;

    this.usersServ.updatePass( user )
      .subscribe({
        next: ( resp ) => {
          Swal.fire('Actualizacion exitosa', 'La contraseña se actualizó correctamente','success');
        }
      })
  }
}
