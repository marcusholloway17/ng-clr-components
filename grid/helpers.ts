import { RecordType } from "./types";

/**
 * Removed provided key from the list of object properties
 *
 * @internal
 *
 * @param _object
 * @param key
 */
export function remove<T extends Record<string, unknown>>(
  _object: T,
  ...keys: (keyof T)[]
) {
  let values = { ..._object } as Omit<T, keyof T>;
  for (const prop of keys) {
    let { [prop]: _, ...v } = values;
    values = { ...v };
  }
  return values as T & Omit<T, keyof T>;
}

/**
 * Check if object is empty.
 *
 * **Note** Object is empty if the object is null or undefined or all properties
 * of the object are null, undefined of empty string
 */
export function isEmpty(value: Record<string, unknown> | null | undefined) {
  if (typeof value === 'undefined' || value === null) {
    return true;
  }

  let result = true;
  for (const prop of Object.keys(value)) {
    if (
      typeof value[prop] !== 'undefined' &&
      value[prop] !== null &&
      value[prop] !== ''
    ) {
      result = false;
      break;
    }
  }

  return result;
}

/**
 * @internal
 */
export function resizeRecords(records: RecordType[], max: number) {
  const length = records.length;
  let result: RecordType[] = [...records];
  if (length < max) {
    for (let index = length; index < max; index++) {
      result.push({ index });
    }
  }
  return result;
}