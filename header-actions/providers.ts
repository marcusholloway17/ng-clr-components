import { Inject, Injector, Provider } from '@angular/core';
import { Observable, from, isObservable, of } from 'rxjs';
import { HeaderAction } from './types';
import { HEADER_ACTIONS_FACTORY } from './tokens';

type InjectorFnOr<T> = T | ((injector: Injector | null) => T);
type ObservableOr<T> = T | Observable<T>;

/**
 * Check is value is a promise instance variable
 */
function isPromise(value: unknown): value is Promise<unknown> {
  return (
    typeof value === 'object' &&
    typeof (value as Promise<unknown>).then === 'function' &&
    typeof (value as Promise<unknown>).catch === 'function'
  );
}

/**
 * @internal
 */
function asObservable(value: unknown) {
  return isObservable(value) || isPromise(value) ? from(value) : of(value);
}

/**
 * Provides a global list of header actions for an application. These actions
 * are added to the top right of the topbar / application header component.
 *
 * ```
 * {
 *      providers: [
 *        // List of providers
 *        provideHeaderActions([{
 *          label: 'MyAction',
 *          fn: '/dashboard/users'
 *        }])
 *      ]
 * ```
 *
 */
export function provideHeaderActions(
  actions: InjectorFnOr<ObservableOr<HeaderAction[]>> = []
) {
  return {
    provide: HEADER_ACTIONS_FACTORY,
    useFactory: () => {
      return typeof actions === 'function' && actions !== null
        ? (injector: Injector | null) => {
            return asObservable(actions(injector));
          }
        : () => asObservable(actions);
    },
    deps: [],
  } as Provider;
}
