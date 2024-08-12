import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cellError',
  pure: true,
  standalone: true,
})
export class CellErrorsPipe implements PipeTransform {
  // Query for cell errors using the row index
  // and the column name
  transform<T>(
    name: string,
    errors: Record<number, { name: string; errors: T[] }[]> | null | undefined,
    index: number
  ) {
    if (!errors) {
      return { errors: null };
    }

    // Select the error at the provided index in the dictionnary of errors
    const error = errors[index];

    if (!error) {
      return { errors: null };
    }

    // Find the index where error is located
    const _index = error.findIndex((current) => current.name === name);

    // Get the list of constraints error at the provided index
    return { errors: error[_index]?.errors ?? [] };
  }
}
