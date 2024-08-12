import { Pipe, PipeTransform } from '@angular/core';
import { OptionGridColumType } from '../types';

@Pipe({
  name: 'asOption',
  pure: true,
  standalone: true
})
export class AsOptionPipe implements PipeTransform {
  // Cast provided value to grid option column type
  transform(value: unknown) {
    return value as OptionGridColumType;
  }
}
