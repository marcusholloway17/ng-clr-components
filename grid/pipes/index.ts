import { AsOptionPipe } from './as-option.pipe';
import { AtPipe } from './at.pipe';
import { CellErrorsPipe } from './cell-errors.pipe';
import { ColumnTypePipe } from './column.type.pipe';
import { ComputeValuePipe } from './compute-value.pipe';
import { FirstErrorParamsPipe, FirstErrorPipe } from './first-error.pipe';
import { GridRecordPipe } from './grid-line.pipe';
import { HasErrorPipe } from './has-error.pipe';
import { IsDeletedPipe } from './is-deleted.pipe';
import { IsEmptyPipe } from './is-empty.pipe';
import { LastRecordIndexPipe } from './last-record-index';
import { OptionValuePipe } from './option-value';
import { OptionValuesPipe } from './option-values.pipe';
import { ParseIntPipe } from './parse-int.pipe';
import { ParseStrPipe } from './parse-str.pipe';
import { PropertyValuePipe } from './property.pipe';

/**
 * List of exported pipes
 */
export default [
  ColumnTypePipe,
  GridRecordPipe,
  PropertyValuePipe,
  OptionValuesPipe,
  AsOptionPipe,
  OptionValuePipe,
  ComputeValuePipe,
  CellErrorsPipe,
  HasErrorPipe,
  ParseStrPipe,
  AtPipe,
  ParseIntPipe,
  FirstErrorPipe,
  FirstErrorParamsPipe,
  LastRecordIndexPipe,
  IsEmptyPipe,
  IsDeletedPipe
] as const;

/**
 * Exportef compute value pipe
 */
export { ComputeValuePipe } from './compute-value.pipe';
export { ParseIntPipe } from './parse-int.pipe';
