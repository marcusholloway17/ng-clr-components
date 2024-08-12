import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'array',
  pure: true,
})
export class ArrayPipe implements PipeTransform {
  // Return the value passed as array
  transform(value: any): any[] {
    return Array.isArray(value)
      ? value
      : typeof value === 'undefined' || value == null
      ? []
      : [value];
  }
}
