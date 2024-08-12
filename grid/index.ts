import { GridComponent } from './grid.component';
import { ComputeValuePipe } from './pipes';

// Export type declarations
export {
  GridColumnType,
  OptionValueType,
  CellChangeEventType,
  DeleteEventType,
  RecordType,
  GridViewType,
  ViewChangeType,
  ConstraintFn,
  ErrorType,
} from './types';

// Export view change handlers
export {
  DATAGRID_VIEW_CHANGES_CACHE,
  DATAGRID_VIEW_CHANGES,
  DATAGRID_VIEW_CHANGES_HANDLER,
  DataGridViewChangesType,
  DataGridViewChangesHandler,
} from './view-changes';

// Export providers
export { provideDataGridViewChanges } from './providers';

// Export the grid component as the default
export default [GridComponent, ComputeValuePipe] as const;

// Exported constraints
export {
  useRequired,
  useMax,
  useMaxLength,
  useMin,
  useMinLength,
} from './constraints';

// Exported validation functions
export { validateCell, validateGridView } from './validation';


// Exported helpers
export {isEmpty, remove} from './helpers';