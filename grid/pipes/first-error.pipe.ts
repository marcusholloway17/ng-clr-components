import { Pipe, PipeTransform } from '@angular/core';
import { ErrorType } from '../types';

@Pipe({
  name: 'firstError',
  pure: true,
  standalone: true,
})
export class FirstErrorPipe implements PipeTransform {
  // Returns the first error from the list of errors
  transform(value: { errors: ErrorType[] | undefined | null }) {
    return value.errors ? value.errors[0].message ?? '' : '';
  }
}

@Pipe({
  name: 'firstErrorParams',
  pure: true,
  standalone: true,
})
export class FirstErrorParamsPipe implements PipeTransform {
  // Returns the first error from the list of errors
  transform(value: { errors: ErrorType[] | undefined | null }) {
    return value.errors ? value.errors[0].params : null;
  }
}
