import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'supported',
})
export class ActionSupportedPipe implements PipeTransform {
  transform(value: string, actions: string[]) {
    return (actions ?? ([] as string[])).indexOf(value) !== -1;
  }
}
