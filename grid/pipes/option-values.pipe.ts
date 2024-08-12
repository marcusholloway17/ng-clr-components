import { Pipe, PipeTransform } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { OptionValueType } from '../types';

@Pipe({
  name: 'options',
  pure: true,
  standalone: true,
})
export class OptionValuesPipe implements PipeTransform {
  // Resolve observable from observable like instance or from a function
  transform(
    value:
      | undefined
      | null
      | Observable<OptionValueType[]>
      | Promise<OptionValueType[]>
      | (() => Observable<OptionValueType[]> | Promise<OptionValueType[]>)
  ) {

    // Case the option is an array we simply
    // return an observable of the array values
    if (Array.isArray(value)) {
      return of(value);
    }

    // 
    return from(
      typeof value === 'function'
        ? value()
        : value ?? of([] as OptionValueType[])
    );
  }
}
