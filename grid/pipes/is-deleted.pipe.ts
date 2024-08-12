import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isDeleted',
  pure: true,
  standalone: true,
})
export class IsDeletedPipe implements PipeTransform {
  //
  transform(index: number, indexes: number[]) {
    return indexes.indexOf(index) !== -1;
  }
}
