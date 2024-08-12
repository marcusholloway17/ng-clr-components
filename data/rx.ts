import { Observable, mergeMap } from 'rxjs';
import { Intercept, NextCallback } from './types';

/**
 * An action pipeline is a higher order observable operator that takes as argument
 * an interceptor function and a destination function.
 *
 * The interceptor function should internally invoke the next callback with the transform
 * traveler (or return an observable/type returned by the next$ callback to break the execution flow
 * and return it own data type)
 */
export function actionPipeline$<T = unknown, T2 = T | any, R = unknown>(
  intercept: Intercept<T, R>,
  next$: (input: T2) => Observable<R>
) {
  return (traveler: Observable<T>) => {
    return traveler.pipe(
      mergeMap((value) =>
        intercept(value, ((current) => next$(current)) as NextCallback<any, R>)
      )
    );
  };
}
