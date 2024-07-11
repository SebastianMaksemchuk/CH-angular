import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullName'
})
export class FullNamePipe implements PipeTransform {

  transform(value: {firstName: string, lastName: string}): unknown {
    return `${value.firstName} ${value.lastName}`
  }

}
