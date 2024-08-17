import { Pipe, PipeTransform } from '@angular/core';
import { UserRole } from '../interfaces/user';

@Pipe({
  name: 'roleName'
})
export class RoleNamePipe implements PipeTransform {

  transform(value: { role: UserRole }): unknown {
    switch (value.role) {
      case 'ADMIN':
        return 'Administrador';
      case 'TEACHER':
        return 'Profesor';
      case 'STUDENT':
        return 'Alumno';
      default:
        return 'Indefinido'
    }
  }
}
