import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  CellChangeEventType,
  ConstraintFn,
  DeleteEventType,
  ErrorType,
  GridColumnType,
  GridErrorsType,
  GridViewType,
  RecordType,
} from './types';
import { ClarityModule } from '@clr/angular';
import { CellModeType, SelectionChangeType } from './cell';
import { CommonModule } from '@angular/common';
import { NgxCommonModule } from '@azlabsjs/ngx-common';
import PIPES from './pipes';
import CELL_DIRECTIVES from './cell';
import { validateCell } from './validation';
import { isEmpty, remove, resizeRecords } from './helpers';

/**
 * Set state argument type declaration
 */
type SetStateArg<T> = Partial<T> | ((s: T) => T);

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NgxCommonModule,
    ClarityModule,
    ...CELL_DIRECTIVES,
    ...PIPES,
  ],
  selector: 'ngx-grid-view',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent
  implements OnInit, OnChanges, AfterViewInit, GridViewType
{
  // #region Component inputs
  /**
   * Columns configuration values
   */
  @Input() columns!: GridColumnType[];

  /**
   * List of records values that will be used to fill the rows
   */
  @Input() records: RecordType[] = [];

  /**
   * The amount by which values are incremented
   */
  @Input() increments = 20;

  /**
   * Case the value of this property is true, the grid will
   * in readonly mode
   */
  @Input() disabled: boolean = false;
  @Input() textViewRef!: TemplateRef<any>;
  @Input() optionViewRef!: TemplateRef<any>;
  @Input() errors!: GridErrorsType | undefined;
  @Input() deleted: number[] = [];
  // #endregion Component inputs

  // #region Component outputs
  @Output() recordsChange = new EventEmitter<RecordType[]>();
  @Output() cellChange = new EventEmitter<CellChangeEventType>();
  @Output() remove = new EventEmitter<DeleteEventType>();
  @Output() errorsChange = new EventEmitter<GridErrorsType>();
  @Output() viewInit = new EventEmitter<true>();
  // #endregion Component outputs

  // #region Component properties
  _state = {
    indexes: [] as number[],
    selected: undefined as { x: number; y: number } | undefined,
    records: [] as RecordType[],
    errors: {} as Record<number, { name: string; errors: ErrorType[] }[]>,
  };
  /**
   * The actual size of the grid component
   */
  _size: number = 10;
  size() {
    return this._size;
  }
  get state() {
    return this._state;
  }
  private _height = '100%';
  get height() {
    return this._height;
  }
  private _init = false;
  // #endregion Component properties

  @ViewChild('clrgrid', { static: true, read: ElementRef })
  gridContainer!: ElementRef<HTMLElement>;

  // #region Class properties
  // #endregion Class properties

  // Component construtor function
  constructor(private changes: ChangeDetectorRef, private host: ElementRef) {}

  // After view init
  ngAfterViewInit(): void {
    this._height = `${
      (this.host.nativeElement as HTMLElement).getBoundingClientRect().height
    }px`;

    // Case it's the first time the component is being initialized, fire a view init
    // for component to run any change detection manually
    if (!this._init) {
      const timeout = setTimeout(() => {
        this.viewInit.emit(true);
        clearTimeout(timeout);
      }, 1000);
      this._init = true;
    }
  }

  // Handle component initialization
  ngOnInit(): void {
    // Case the length of the records is greater than the size
    //  while the the size of the grid is less than the length of records
    // increment the size of the grid by 50
    this._size = this.resizeGrid(this.records, this._size);
  }

  // Handles component input changes
  ngOnChanges(changes: SimpleChanges): void {
    // Case the records changes, resize the grid
    // to avoid any issue with the grid
    if ('records' in changes) {
      this._size = this.resizeGrid(this.records, this._size);
    }

    // Set errors case errors property changes
    if ('errors' in changes && this.errors) {
      this.setState((state) => ({
        ...state,
        errors: this.errors as GridErrorsType,
      }));
    }
  }

  public getRecords() {
    return [...this._state.records];
  }

  onCellClicked(event: Event, x: number, y: number) {
    this.setState((state) => ({ ...state, selected: { x, y } }));
    event?.preventDefault();
  }

  onRemoveRecord(event: Event, record: RecordType, index: number) {
    const records = [...this._state.records];
    let _removedIndex = records.findIndex(
      (item) => item && Number(item['index']) === index
    );

    // Set the remove index to equals the index entity in order to solve bug
    if (_removedIndex === -1) {
      return;
    }

    // To prevent any bug on the UI, reset the object at index to a partially empty object
    records.splice(_removedIndex, 1);

    // Setting state on splice
    this.setState((state) => ({ ...state, records }));

    // Dispatch a record changes event
    this.recordsChange.emit(records);

    // Emit delete event for the cell element
    this.remove.emit({ index, record });

    // Prevent default event handler
    event?.preventDefault();
  }

  onValueChange(
    index: number,
    event: { value: unknown; name: string; constraints?: ConstraintFn[] },
    columns: GridColumnType[],
    indexes: number[]
  ) {
    const { value, name, constraints, records } = { ...event, ...this._state };
    const _changedIndex = records.findIndex(
      (item) => item && Number(item['index']) === index
    );
    const _record =
      _changedIndex !== -1 ? records[_changedIndex] ?? { index } : { index };

    // Set the change state object
    let change = { ..._record, [name]: value };

    // Case the current column has constraints, we emit the return value of
    // cell constraints
    if (constraints) {
      // Case the value constraint fails, we simply return from the execution
      // context to without emitting any grid change
      const constraintResult = validateCell(constraints, value, change);

      // Next the error constraint if any
      this.nextError(index, name, constraintResult);

      // We do not publish any change when the cell constraint fails
      if (constraintResult.length > 0) {
        // TODO: Checks if records should be updated if the grid cell value
        // constraint fails
        return;
      }
    }

    // Query columns that declared the current column as watchable and compute
    // cell value or cell constraint based on configuration definition
    const _columns = columns.filter((c) => c.watch && c.watch.includes(name));
    for (const column of _columns) {
      // Compute value for columns that with configuration having
      // compute declaration
      if (column.compute) {
        const computed = column.compute(
          change,
          column.name,
          change[column.name]
        );
        change[column.name] = computed;
        // Emit an event for the computed value if the previous value hold
        // by the record changed
        if (_record[column.name] !== change[column.name]) {
          this.cellChange.emit({
            name: column.name,
            value: change[column.name],
            record: change,
            index,
            records,
          });
        }
      }

      // Case a column is configured to watch changes on the
      // current column cell values, we check if those column has constraints
      // then dispatch an error event or valid event if those constraint fails or passes
      if (column.constraints) {
        this.nextError(
          index,
          column.name,
          validateCell(column.constraints, change[column.name], change)
        );
      }
    }

    // Update the cell value for the given index
    records.splice(_changedIndex, 1, change);

    // Dispatch a record changes event
    this.recordsChange.emit(records);

    // Update component state
    this.setState((state) => ({ ...state, records }));

    // Emit a cell change event to component host
    this.cellChange.emit({
      ...event,
      record: change,
      index,
      records,
    });

    // Case cell value changes and the index that change is greater
    // than the length of the grid - 3
    if (index > indexes.length - 3) {
      // Case the the size of the grid equals the total length of records,
      // increase the size of the grid by the half on the
      this._size += Math.min(this.increments, 20) / 2;
    }
  }

  onSelectionChange(event: SelectionChangeType, y: number, count: number) {
    const { mode, index: x, direction } = event;
    if (mode === 'view') {
      const directions = {
        forward: {
          x: x + 1 > count - 1 ? 0 : x + 1,
          y: x + 1 > count - 1 ? y + 1 : y,
        },
        backward: {
          x: x === 0 ? count - 1 : x - 1,
          y: x === 0 ? y - 1 : y,
        },
        top: {
          x,
          y: y - 1,
        },
        down: {
          x,
          y: y + 1,
        },
      };

      this.setState((state) => ({
        ...state,
        // Case the next cell bound is greater that the total cell
        //  focus the next row first cell
        selected: directions[direction],
      }));
    }
  }

  onCellModeChange(mode: CellModeType) {
    if (mode === 'view') {
      this.setState((state) => ({
        ...state,
        // Case the next cell bound is greater that the total cell
        //  focus the next row first cell
        selected: undefined,
      }));
    }
  }

  // Dispatch errors changes for a given index case an error occurs
  // This will update the ui setting cell border to red case cell has errors
  // or default color case cell error list equals 0
  private nextError(index: number, name: string, errors: ErrorType[]) {
    const _errors = this._state.errors ?? {};
    const _indexErrors = _errors[index] ?? [];
    const _errorIndex = _indexErrors.findIndex((error) => error.name === name);
    if (_errorIndex !== -1) {
      _indexErrors.splice(_errorIndex, 1, { name, errors });
    } else {
      _indexErrors.push({ name, errors });
    }

    // update the error list at the provided index
    this.setState((state) => ({
      ...state,
      errors: { ..._errors, [index]: _indexErrors },
    }));

    // Next the error event or value
    this.errorsChange.next(this._state.errors);
  }

  // Computes component state and trigger UI update
  private setState(state: SetStateArg<typeof this._state>) {
    this._state =
      typeof state === 'function' && state !== null
        ? state({ ...this._state })
        : { ...this._state, ...state };
    this.changes?.markForCheck();
  }

  // Resize the grid view to match the size of record + half of the
  // grid incrementation requirement, or to fix the default minimal grid size
  private resizeGrid(records: RecordType[], _size: number) {
    let size = _size;
    if (records.length > size) {
      while (size < records.length) {
        // Increment the size of the grid until it's greater greater than or equals
        // to the records size
        size += Math.min(this.increments, 20);
      }
      if (size === records.length) {
        // Case the the size of the grid equals the total length of records,
        // increase the size of the grid by the half on the
        size += Math.min(this.increments, 20) / 2;
      }
    } else if (
      size === records.filter((r) => !isEmpty(remove(r ?? {}, 'index'))).length
    ) {
      size = size + Math.min(this.increments, 20) / 2;
    }

    // Set the grid state with the resized records
    this.setState((state) => ({
      ...state,
      indexes: [...Array(size).keys()],
      records: resizeRecords(records, size),
    }));

    // Return the size of the grid after resizing
    return size;
  }
}
