import { Pipe, PipeTransform } from '@angular/core';
import { GridLineType, GridColumnType } from '../types';

@Pipe({
  name: 'gridRecord',
  pure: true,
  standalone: true,
})
export class GridRecordPipe implements PipeTransform {
  // Provide transformation from columns to cells
  transform(index: number, columns: GridColumnType[], frozen: boolean) {
    return {
      index,
      cells: columns.map((column, i) => ({
        column,
        styles: [],
        index: i,
        position: index * columns.length + i,
        frozen:
          column.frozen ??
          (typeof frozen === 'undefined' || frozen === null ? false : frozen)
      })),
    } as GridLineType;
  }
}
