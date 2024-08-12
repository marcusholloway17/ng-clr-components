import { Pipe, PipeTransform } from '@angular/core';
import { RecordType } from '../types';

@Pipe({
  name: 'computeCellValue',
  pure: false,
  standalone: true,
})
export class ComputeValuePipe implements PipeTransform {
  // Compute the value for a given cell
  transform(
    value: unknown,
    record: RecordType,
    name: string,
    compute?: (
      record: Record<string, unknown>,
      name: string,
      value?: unknown
    ) => string | number
  ) {
    return compute ? compute(record ?? {}, name, value) : value;
  }
}
