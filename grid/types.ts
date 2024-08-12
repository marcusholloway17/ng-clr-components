import { Observable } from 'rxjs';

/**
 * Data grid view type declaration
 */
export type GridViewType = {
  /**
   * List of records of the grid view component
   */
  getRecords(): RecordType[] | null;

  /**
   * List of columns of the gridview component
   */
  columns: GridColumnType[] | null;
};

/**
 * Column type declaration
 */
export type ColumType = 'text' | 'number' | 'date' | 'option';

/**
 * option value type declaration
 */
export type OptionValueType = {
  id: string | number;
  label: string;
};

/**
 * Provides type declaration for constraint function return type
 * @internal
 */
export type ErrorType = { message: string; params?: Record<string, unknown> };

/**
 * Constraint function type declaration
 */
export type ConstraintFn = (
  value: unknown,
  state: Record<string, unknown>
) => ErrorType | undefined;

/**
 * Column metadata type definition
 */
type BaseColumnType = {
  title: string;
  name: string;
  transformTitle?: string | string[];
  frozen?: boolean;
  transform?:
    | (string | ((value: unknown) => unknown))
    | (string | ((value: unknown) => unknown))[];
  width?: string;

  /**
   * Add a function to compute the value of a given cell
   */
  compute?: (
    record: Record<string, unknown>,
    name: string,
    value?: unknown
  ) => string | number;

  /**
   * Case the column value should be compute, this configuration
   * provide list of columns to watch for changes
   */
  watch?: string[];
};

/**
 * Provide type declaration for constrained column
 */
type ConstrainedColumn = {
  constraints?: ConstraintFn[];
};

/**
 * @internal
 *
 * Provide a grid column type declaration for options input
 */
export type OptionGridColumType = BaseColumnType &
  ConstrainedColumn & {
    type: 'option';
    /**
     * Options can be of type list of strings (selectable list of values),
     * string (url to fetch values from), Option(preconfigured list of values)
     */
    options:
      | Observable<OptionValueType[]>
      | Promise<OptionValueType[]>
      | (() => Observable<OptionValueType[]> | Promise<OptionValueType[]>);
  };

/**
 * Provide a grid column type declaration for basic input
 */
export type BasicGridColumnType = BaseColumnType &
  ConstrainedColumn & {
    type: 'text' | 'number' | 'date';
  };

/**
 * Type definition of a record grid column
 */
export type GridColumnType = BasicGridColumnType | OptionGridColumType;

/**
 * Cell styles type definition
 */
type Style = string | { [prop: string]: unknown };

/**
 * Grid cell type definition
 */
export type GridCellType = {
  column: GridColumnType;
  index: number;
  styles: Style[];
  position: number;
  frozen: boolean;
};

/**
 * Grid record type declaration
 */
export type GridLineType = {
  /**
   * Record index value
   */
  index: number;
  /**
   * List of grid cells
   */
  cells: GridCellType[];
};

/**
 * Grid record type declaration
 */
export type RecordType = Record<string, unknown> | undefined | null;

/**
 * Grid record deleted event type declaration
 */
export type DeleteEventType = {
  index: number;
  record: RecordType;
};

/**
 * Grid cell change event type declaration
 */
export type CellChangeEventType = {
  name: string;
  value: unknown;
  index: number;
  record: RecordType;
  records: RecordType[];
};

/**
 * View changes type declaration
 */
export type ViewChangeType<T> = {
  index: number;
  action: -1 | 1;
  value: T;
  id: string;
  complete?: (change: ViewChangeType<T>, result: T) => void;
  error?: (change: ViewChangeType<T>, error?: unknown) => void;
};

/**
 * @internal
 * 
 * Provides type declarations for grid errors
 */
export type GridErrorsType = {
  [prop: number]: { name: string; errors: ErrorType[] }[];
};
