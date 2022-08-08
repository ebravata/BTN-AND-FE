import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { UsersService } from '../../../services/users.service';
import { User } from '../../../interfaces/user.interface';
import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: [
  ]
})
export class UserComponent implements OnInit {
  public user!: User;
  public userForm!: FormGroup;
  public loading = true;
  public modifyUser = false;
  private uid!: string;

  constructor( private usersServ: UsersService,
               private activatedRoute: ActivatedRoute,
               private fb: FormBuilder,
               private router: Router ) {}

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( ({ id }) => {

      this.uid = id;

      if ( this.uid !='nuevo'){
        this.getUser( id );
        this.modifyUser = true;
      }
      else
        this.newUser();
    })

    this.loadDataForm()
  }

  newUser(){

    this.user = {
      uid: '',
      name: '',
      email: '',
      department: 'MANTTO',
      role: 'USER_ROLE'
    }
    this.loadDataForm()
    this.loading = false;

  }

  getUser( id: string ){

    this.usersServ.getUser( id )
      .subscribe( ({ user }:any) => {
        this.user = user;
        this.loading = false;
        this.loadDataForm();
      })
  }

  loadDataForm(){

    if ( this.user ){

      this.userForm = this.fb.group ({

        name: [ this.user.name || '', Validators.required ],
        email: [ this.user.email || '', [ Validators.required, Validators.email] ],
        role: [ this.user.role || '', Validators.required ],
        department: [ this.user.department || '', Validators.required ]

      })
    }
  }

  save(){

    if (  this.uid != 'nuevo'){

      // update user
      const userData = {
        uid: this.uid ,
        ...this.userForm.value
      }

      this.usersServ.updateUser( userData )
      .subscribe({
        next: ( resp ) => {
          Swal.fire('¡Datos actualizados!','Los datos se actualizaron correctamente','success')
          this.router.navigateByUrl('/dashboard/users');
        }
      })
    }else {

      // add new user
      const userData = {
        password: 'user',
        ...this.userForm.value
      }

      this.usersServ.createUser( userData )
      .subscribe({
        next: ( resp ) => {

          Swal.fire('¡Usuario Agregado!','Los datos se guardaron correctamente','success')
          this.router.navigateByUrl('/dashboard/users');

        },

      })
    }
  }
}
