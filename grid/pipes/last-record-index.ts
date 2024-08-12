import { Pipe, PipeTransform } from '@angular/core';
import { RecordType } from '../types';
import { isEmpty, remove } from '../helpers';

@Pipe({
  name: 'lastRecordIndex',
  pure: true,
  standalone: true,
})
export class LastRecordIndexPipe implements PipeTransform {
  // Returns the records of the last record
  transform(values: RecordType[]) {
    const lastIndex = values.length - 1;
    const filteredValues = values.filter(
      (value) => !isEmpty(remove(value ?? {}, 'index'))
    );
    const filterLastIndex = filteredValues.length - 1;
    const element = filteredValues[filterLastIndex];
    return element ? element['index'] : lastIndex;
  }
}
