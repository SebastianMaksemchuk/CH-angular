import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'featureName'
})

export class FeatureNamePipe implements PipeTransform {

  transform(value: string| null): string {
    if (!value) {
      return 'Error en featureNamePipe';
    }
    switch (value) {
      case 'home':
        return 'Inicio';
      case 'courses':
        return 'Cursos';
      case 'students':
        return 'Alumnos';
      case 'enrollments':
        return 'Inscripciones';
      case 'users':
        return 'Usuarios';
      default:
        return 'Indefinido';
    }
  }
}
