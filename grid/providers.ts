import { Injector, Provider } from '@angular/core';
import {
  DATAGRID_VIEW_CHANGES,
  DataGridViewChanges,
  DataGridViewChangesHandler,
} from './view-changes';
import { DOCUMENT } from '@angular/common';

/**
 * Provides internal implementation of data grid view changes service
 *
 * @param changesHandler Factory function that creates a change handler factory instance for processing data grid view changes
 * @param cacheFactory Factory function that creates a cache instance that allow the changes service to provide caching for failed synchornizations
 * @param cacheKey changes cache key name
 */
export function provideDataGridViewChanges(
  changesHandler: (injector: Injector) => DataGridViewChangesHandler,
  cacheFactory?: (injector: Injector) => Storage,
  cacheKey?: string
) {
  return {
    provide: DATAGRID_VIEW_CHANGES,
    useFactory: (injector: Injector) => {
      const { defaultView } = injector.get(DOCUMENT);
      const _cacheFactory = cacheFactory
        ? cacheFactory(injector)
        : defaultView
        ? defaultView.sessionStorage
        : null;
      return new DataGridViewChanges(
        changesHandler(injector),
        _cacheFactory,
        cacheKey
      );
    },
    deps: [Injector],
  } as Provider;
}
