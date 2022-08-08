import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'role'
})
export class RolePipe implements PipeTransform {

  transform(role: string): string {

    let roleVal: string;

    switch (role) {
      case 'ADMIN_ROLE':
        return roleVal = 'Admin'
        break;

      case 'USER_ROLE':
        return roleVal = 'Usuario'
        break;

      default:
        return roleVal = 'no_user'
        break;
    }

    // return roleVal;
  }

}
