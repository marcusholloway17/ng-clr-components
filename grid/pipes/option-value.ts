import { Pipe, PipeTransform } from '@angular/core';
import { OptionValueType } from '../types';

@Pipe({
  name: 'option',
  pure: true,
  standalone: true,
})
export class OptionValuePipe implements PipeTransform {
  // Resolve value for a given option key
  transform(
    value: any,
    values: OptionValueType[],
    property: keyof OptionValueType = 'label'
  ) {
    if (value) {
      const result = values.find((v) => v.id.toString() === value.toString());
      return result ? result[property] : value;
    }
    return '';
  }
}
