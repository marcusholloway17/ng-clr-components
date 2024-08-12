import { Pipe, PipeTransform } from '@angular/core';

type ValueArgType = string | ((item: unknown) => string);

@Pipe({
  name: 'actionTitle',
})
export class ActionTitlePipe implements PipeTransform {
  /**
   * Transform the provided value and return the title string
   */
  transform(value: ValueArgType, item?: unknown): string {
    if (typeof value === 'function') {
      return value.call(null, item);
    }
    return value;
  }
}
