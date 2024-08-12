import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'disabledAction',
  pure: true,
})
export class DisabledActionPipe implements PipeTransform {
  //
  transform(
    value: unknown,
    fn: boolean | undefined | ((value: unknown) => boolean)
  ) {
    if (typeof fn === 'undefined' || fn === null) {
      return false;
    }
    return typeof fn === 'function' ? fn(value) : Boolean(value);
  }
}
