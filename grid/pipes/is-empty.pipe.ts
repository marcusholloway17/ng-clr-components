import { Pipe, PipeTransform } from '@angular/core';
import { RecordType } from '../types';
import { isEmpty, remove } from '../helpers';

@Pipe({
  name: 'isEmpty',
  pure: true,
  standalone: true,
})
export class IsEmptyPipe implements PipeTransform {
  //
  transform(value: RecordType) {
    return (
      typeof value === 'undefined' ||
      value === null ||
      isEmpty(remove(value ?? {}, 'index'))
    );
  }
}
