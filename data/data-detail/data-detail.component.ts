import { Component, Input, TemplateRef } from '@angular/core';
import { DetailColumnType, DetailColumnTypes } from './types';

/**
 * @internal
 */
type ColumnType = Omit<DetailColumnType, 'style'> & {
  styles?: Record<string, boolean>;
  cssClass?: string;
};

/**
 * Create list of columns from the provides list of columns
 * ]
 * @param values
 */
function createColumns(values: DetailColumnType[]) {
  return values.map((column) => ({
    title: column.title,
    titleTransform: column.titleTransform,
    field: column.field || '',
    style: column.style
      ? {
          cssClass: Array.isArray(column.style.cssClass)
            ? column.style.cssClass.join(' ')
            : column.style.cssClass ?? '',
          styles: Array.isArray(column.style.styles)
            ? column.style.styles.reduce((carry, curr) => {
                carry[curr] = true;
                return carry;
              }, {} as Record<string, boolean>)
            : column.style.styles ?? {},
        }
      : { cssClass: '', styles: '' },
    transform: column.transform ?? 'default',
  }));
}

@Component({
  selector: 'ngx-data-detail',
  templateUrl: './data-detail.component.html',
  styleUrls: ['./data-detail.component.css'],
})
export class DataDetailComponent {
  // #region Component inputs
  @Input() data!: Record<string, unknown> | Record<string, unknown>[];
  @Input() layout: 'v' | 'vertical' | 'h' | 'horizontal' = 'vertical';
  @Input('before-detail') beforeDetailRef!: TemplateRef<unknown>;
  @Input('after-detail') afterDetailRef!: TemplateRef<unknown>;
  private _columns!: Array<ColumnType>;
  @Input() set columns(values: DetailColumnTypes) {
    // Map input value to typeof Required<GridColumn> type definitions
    this._columns = createColumns(values ?? []);
  }
  get columns() {
    return this._columns;
  }
  @Input() preview!: TemplateRef<any> | null;
  // #endregion Component inputs
}
