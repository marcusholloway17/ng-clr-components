import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percent',
  pure: true,
  standalone: true,
})
export class PercentPipe implements PipeTransform {
  // Compute the import percentage from the total and value
  transform(value: number, total: number) {
    if (total <= 0) {
      throw new Error('Total value cannot not be less than or equal to zero!');
    }
    return Math.floor((value / total) * 100);
  }
}
