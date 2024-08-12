/**
 * Creates a constraint function that fails when provided value is null, undefined or empty string
 */
export function useRequired() {
  return (value: unknown) =>
    typeof value === 'undefined' ||
    value === null ||
    (typeof value === 'string' && value.trim() === '')
      ? { message: 'constraints.required' }
      : undefined;
}

/**
 * Creates a constraint function that fails when string length is greater than `length`
 */
export function useMaxLength(length: number) {
  return (value: unknown) =>
    String(value).length > length
      ? { message: 'constraints.maxLength', params: { value: length } }
      : undefined;
}

/**
 * Creates a constraint function that fails when string length is less than `length`
 */
export function useMinLength(length: number) {
  return (value: unknown) =>
    String(value).length >= length
      ? { message: 'constraints.minLength', params: { value: length } }
      : undefined;
}

/**
 * Creates a constraint function that fails number is less than `size`
 */
export function useMin(size: number) {
  return (value: unknown) =>
    Number(value) < size
      ? { message: 'constraints.min', params: { value: size } }
      : undefined;
}

/**
 * Creates a constraint function that fails number is greater than `size`
 */
export function useMax(size: number) {
  return (value: unknown) =>
    Number(value) > size
      ? { message: 'constraints.max', params: { value: size } }
      : undefined;
}
