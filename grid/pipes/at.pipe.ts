import { Pipe, PipeTransform } from '@angular/core';
import { RecordType } from '../types';

@Pipe({
  name: 'at',
  pure: true,
  standalone: true
})
export class AtPipe implements PipeTransform {
  //
  transform(index: number, record: RecordType[]) {
    return record.find((item) => item && Number(item['index']) === index);
  }
}
