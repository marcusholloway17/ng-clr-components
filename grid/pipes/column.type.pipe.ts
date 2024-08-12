import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'columType',
  pure: true,
  standalone: true
})
export class ColumnTypePipe implements PipeTransform {
  //
  transform(_type: string) {
    if (['option', 'text', 'date'].includes(_type)) {
      return 'string';
    }
    return 'number';
  }
}
