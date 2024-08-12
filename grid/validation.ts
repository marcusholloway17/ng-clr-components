import { isEmpty, remove } from './helpers';
import { ConstraintFn, ErrorType, GridColumnType, RecordType } from './types';

/**
 * Validates grid cell's value
 */
export function validateCell<T extends ErrorType = ErrorType>(
  constraints: ConstraintFn[],
  value: unknown,
  record: Record<string, unknown>
): T[] {
  return constraints.reduce((carr, curr) => {
    const result = curr(value, record) as T;
    if (typeof result !== 'undefined' && result !== null) {
      carr.push(result);
    }
    return carr;
  }, [] as T[]);
}

/**
 * Validates grid view state and return the list of errors if validation fails
 */
export function validateGridView(
  records: RecordType[],
  columns: GridColumnType[]
) {
  if (typeof records === 'undefined' || records === null) {
    return { root$: [{ message: 'constraints.not_empty' }] };
  }

  // Case the data grid is empty, we return a not empty constraint error
  if (records.length === 0) {
    return { root$: [{ message: 'constraints.not_empty' }] };
  }

  const _columns = columns ?? [];
  const constraintMap = _columns.reduce((carry, curr) => {
    if (curr.constraints) {
      carry.set(curr.name, curr.constraints);
    }
    return carry;
  }, new Map<string, ConstraintFn[]>());

  // Remove null/undefined values
  const _records = records
    .filter((r) => typeof r !== 'undefined' && r !== null)
    .filter(
      (r) =>
        !isEmpty(remove(r as Record<string, unknown>, 'index', 'statement_id'))
    ) as Record<string, unknown>[];

  // Case the data grid is empty, we return a not empty constraint error
  if (_records.length === 0) {
    return { root$: [{ message: 'constraints.not_empty' }] };
  }
  const errors: Record<string, { name: string; errors: any[] }[]> = {};

  // Loop through all errors
  for (const record of _records) {
    // Case the entire record is empty, continue to the next record
    if (isEmpty(remove(record, 'id', 'index'))) {
      continue;
    }

    const index = record['index'] as keyof typeof errors;

    // Case index does not exists on the record, continue to the next record
    if (typeof index === 'undefined' || index === null) {
      continue;
    }
    for (const prop of Object.keys(record)) {
      const constraints = constraintMap.get(prop) ?? [];
      const result = validateCell(constraints, record[prop], record);
      const _indexErrors = errors[index] ?? [];
      const _errorIndex = _indexErrors.findIndex(
        (error) => error.name === prop
      );
      if (_errorIndex !== -1) {
        _indexErrors.splice(_errorIndex, 1, { name: prop, errors: result });
      } else {
        _indexErrors.push({ name: prop, errors: result });
      }
      errors[index] = _indexErrors;
    }
  }

  // Returns undefined if the errors is empty, else return dictionnary of errors
  return isEmpty(errors) ? undefined : errors;
}
