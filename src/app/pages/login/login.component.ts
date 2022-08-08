import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UsersService } from '../../services/users.service';
import { StationsService } from '../../services/stations-service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  // public assigned: boolean = false;
  public emailErr = '';
  public passwordErr = '';


  constructor( private usersServ: UsersService,
               private stationsServ: StationsService,
               private router: Router  ) { }

  ngOnInit(): void {

    // obtener la direcion Ip cliente
    this.stationsServ.getClientIp().subscribe();
  }

  login( loginForm: NgForm){

    const email = loginForm.controls['email'].value;
    const password = loginForm.controls['password'].value;


    this.usersServ.loginUser( email, password )
        .subscribe({
          next: ( resp: any ) => {

            this.router.navigateByUrl('/verify');

          },
          // error: ( err: any ) => {
          //   // console.log( err );

          //   const { email, password } = err;

          //   if ( email )
          //     this.emailErr = email.msg;
          //   if ( password )
          //     this.passwordErr = password.msg;

          //   if ( !email && !password)
          //     Swal.fire('Error', err, 'error');

          // }
        });
  }

  writting(){

    this.emailErr= '';

  }

}
