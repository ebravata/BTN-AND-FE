import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { StationsService } from '../../services/stations-service';
import { Station } from '../../interfaces/station.interface';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styles: [
  ]
})
export class LogoutComponent implements OnInit {

  constructor( private usersServ: UsersService,
               private stationsServ: StationsService,
               private router: Router) { }

  ngOnInit(): void {

    // this.usersServ.activeUser = {
    //   uid: '',
    //   email: '',
    //   name: '',
    //   role: 'USER_ROLE'
    // };

    // this.stationsServ.station = {
    //   sid: '',
    //   name: '',
    //   description: '',
    //   assigned: false,
    //   ip: ''
    // }



    // localStorage.removeItem('activeUser');
    // localStorage.removeItem('station');

    // this.router.navigateByUrl('/login');

  }

}
