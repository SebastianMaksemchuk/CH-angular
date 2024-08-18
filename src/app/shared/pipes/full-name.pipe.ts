import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullName'
})

export class FullNamePipe implements PipeTransform {

  transform(value: { firstName?: string, lastName?: string } | null): string {
    if (!value) {
      return 'Error en fullNamePipe';
    } else {
      return `${value.firstName || ''} ${value.lastName || ''}`.trim();
    }
  }
}
