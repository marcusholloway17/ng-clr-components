import { Injector, Provider } from '@angular/core';
import { LinkConfigPair, ViewConfig } from './types';
import {
  Observable,
  distinctUntilChanged,
  from,
  isObservable,
  map,
  of,
} from 'rxjs';
import { PAGE_CONFIGS } from './tokens';

/**
 * @internal
 */
function isPromise<T>(value: unknown): value is Promise<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Promise<T>).then === 'function' &&
    typeof (value as Promise<T>).catch === 'function'
  );
}

/**
 * @internal
 */
function flattenLinks(links: LinkConfigPair[]) {
  const result: ViewConfig[] = [];
  const _flatten = (_links: LinkConfigPair[]) => {
    for (const _link of _links) {
      if (_link.config) {
        const _value = {
          href: _link.href,
          config: _link.config,
        } as ViewConfig;
        result.push(_value);
      }
      if ((_link as { links: LinkConfigPair[] })['links']) {
        _flatten((_link as { links: LinkConfigPair[] })['links']);
      }
    }
    return result;
  };
  return _flatten(links);
}

/**
 * Provides injectable page configuration
 */
export function provideDataViewConfigs(
  values:
    | ViewConfig[]
    | ((
        injector: Injector
      ) => ViewConfig[] | Observable<ViewConfig[]> | Promise<ViewConfig[]>)
) {
  return {
    provide: PAGE_CONFIGS,
    useFactory: (injector: Injector) => {
      const value =
        typeof values === 'function'
          ? values(injector)
          : values ?? ([] as ViewConfig[]);
      return isObservable(value) || isPromise(value) ? from(value) : of(value);
    },
    deps: [Injector],
  } as Provider;
}

/**
 * Compute page configuration list from a link page definition
 */
export function provideDataViewConfigsForLink(
  values:
    | LinkConfigPair[]
    | ((
        injector: Injector
      ) =>
        | LinkConfigPair[]
        | Observable<LinkConfigPair[]>
        | Promise<LinkConfigPair[]>)
) {
  return {
    provide: PAGE_CONFIGS,
    useFactory: (injector: Injector) => {
      const value =
        typeof values === 'function'
          ? values(injector)
          : values ?? ([] as ViewConfig[]);
      const observable$ =
        isObservable(value) || isPromise(value) ? from(value) : of(value);
      return observable$.pipe(
        map((state) => flattenLinks(state)),
        distinctUntilChanged()
      );
    },
    deps: [Injector],
  } as Provider;
}
