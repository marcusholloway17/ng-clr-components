import { Pipe, PipeTransform } from '@angular/core';
import { HeaderAction } from '../header-actions';

@Pipe({
  name: 'appendActions',
  standalone: true,
})
export class AppendActionsPipe implements PipeTransform {
  /**
   * Transform the list of action by appending a logout action at the end
   */
  transform(actions: HeaderAction[], _actions: HeaderAction[]) {
    return [...actions, ..._actions].filter(
      (action) =>
        typeof action.label !== 'undefined' &&
        action.label !== null &&
        typeof action.fn !== 'undefined' &&
        action.fn !== null
    );
  }
}
