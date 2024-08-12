import { Injector, Optional, Pipe, PipeTransform } from '@angular/core';
import { from, isObservable, of } from 'rxjs';

/**
 * Checks if a provided value is a promise or not
 */
function isPromise<T>(a: unknown): a is Promise<T> {
  return (
    typeof a === 'object' &&
    a !== null &&
    typeof (a as Promise<T>).then === 'function' &&
    typeof (a as Promise<T>).catch === 'function'
  );
}

@Pipe({
  name: 'asObservable',
})
export class AsObservablePipe implements PipeTransform {
  //
  constructor(@Optional() private injector?: Injector) {}

  /**
   * Transform or convert basic value to an observable of T value.
   */
  transform(value: any) {
    const _value = typeof value === 'function' ? value(this.injector) : value;
    return isObservable(_value) || isPromise(_value)
      ? from<any>(_value)
      : of<any>(_value);
  }
}
