import { Pipe, PipeTransform } from '@angular/core';
import { ErrorType } from '../types';

@Pipe({
  name: 'hasError',
  pure: true,
  standalone: true,
})
export class HasErrorPipe implements PipeTransform {
  // Transform pipe value into boolean
  transform(error: { errors: ErrorType[] | undefined | null }) {
    if (!error.errors) {
      return false;
    }
    return error.errors.length > 0;
  }
}
