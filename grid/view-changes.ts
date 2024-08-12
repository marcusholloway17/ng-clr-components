import {
  Inject,
  Injectable,
  InjectionToken,
  OnDestroy,
  Optional,
} from '@angular/core';
import {
  EMPTY,
  Observable,
  Subject,
  Subscription,
  catchError,
  concatMap,
  // delay,
  filter,
  of,
  startWith,
  tap,
} from 'rxjs';
import { remove } from './helpers';
import { ViewChangeType } from './types';

/**
 * Generates a v4 like universal unique identifier
 *
 * @internal
 */
export function uuid_v4() {
  const v4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return (
    v4() +
    v4() +
    '-' +
    v4() +
    '-' +
    v4() +
    '-' +
    v4() +
    '-' +
    v4() +
    v4() +
    v4()
  );
}

/**
 * Datagrid view changes service type declaration
 */
export type DataGridViewChangesType = {
  addChange(change: Omit<ViewChangeType<Record<string, unknown>>, 'id'>): void;
};

/**
 * Data grid view changes handler type declaration
 */
export type DataGridViewChangesHandler = {
  /**
   * Handles changes on the data grid view
   */
  handle(
    change: ViewChangeType<Record<string, unknown>>,
    networkError: (change: ViewChangeType<Record<string, unknown>>, error?: Error) => void
  ): Observable<unknown>;
};

/**
 * Grid view changes cache injection token
 */
export const DATAGRID_VIEW_CHANGES_CACHE = new InjectionToken<Storage>(
  'GRID VIEW CHANGES Cache'
);

/**
 * Grid view changes injection token
 */
export const DATAGRID_VIEW_CHANGES =
  new InjectionToken<DataGridViewChangesType>('GRID VIEW CHANGES Service');

/**
 * Cache keys for the data grid view changes
 */
const CACHE_KEY = `APP_DATAGRID_VIEW_CHANGES`;

/**
 * Datagrid view changes handler injection token
 */
export const DATAGRID_VIEW_CHANGES_HANDLER =
  new InjectionToken<DataGridViewChangesHandler>('GRIDVIEW CHANGES Handler');

/**
 * VIEW CHANGES Cache Key injection Token
 */
export const DATAGRID_VIEW_CHANGES_CACHE_KEY = new InjectionToken<string>(
  'VIEW CHANGES Cache key'
);

@Injectable()
export class DataGridViewChanges implements OnDestroy, DataGridViewChangesType {
  // #region Class properties
  private _subject$ = new Subject<ViewChangeType<Record<string, unknown>> | null>();
  private _subscriptions: Subscription[] = [];
  // #endregion Class properties

  // Class constructor
  constructor(
    @Inject(DATAGRID_VIEW_CHANGES_HANDLER)
    private handler: DataGridViewChangesHandler,
    @Inject(DATAGRID_VIEW_CHANGES_CACHE)
    @Optional()
    private cache: Storage | undefined | null = null,
    @Inject(DATAGRID_VIEW_CHANGES_CACHE_KEY)
    @Optional()
    private key: string = CACHE_KEY
  ) {
    this.watchChanges();

    // Query the changes cache to resolve values
    const values = this.getChangesFromCache();

    // Case there is values in the cache, we add them to the cache for them to be processed
    if (values.length > 0) {
      for (const change of values) {
        this.addChange(change);
      }
    }
    // TODO: Listen for network status changes
  }

  public addChange(change: Omit<ViewChangeType<Record<string, unknown>>, 'id'>) {
    this._subject$.next({ ...change, id: uuid_v4() });
  }

  private watchChanges() {
    const subscription = this._subject$
      .pipe(
        startWith(null),
        filter((value) => typeof value !== 'undefined' && value !== null),
        // Delay for 5 second before the next synchorization
        // delay(5000),
        concatMap((value) => {
          if (value) {
            return this.handler
              .handle(value, (change) => {
                // Case a network error occured, we add the value to cache
                const values = this.getChangesFromCache();
                // Remove the complete callback from the change state before adding it to the cache
                values.push(remove(change, 'complete'));
                this.dumpChangesToCache(values);
              })
              .pipe(
                catchError((err) => {
                  const errorCallback = value.error ?? (() => {});
                  errorCallback(value, err);
                  return EMPTY;
                }),
                tap((result) => {
                  if (result) {
                    const _complete = value.complete ?? (() => {});
                    _complete(value, result as Record<string, unknown>);
                  }
                  // Case the request handler complete successfully, we simply remove the
                  // cached change that match the change id from the cache
                  const values = this.getChangesFromCache();
                  const index = values.findIndex((v) => v.id === value.id);
                  if (index !== -1) {
                    values.splice(index, 1);
                  }
                  this.dumpChangesToCache(values);
                })
              );
          }
          return of();
        })
      )
      .subscribe();

    // Add subscription to the list of subscription
    this._subscriptions.push(subscription);
  }

  /**
   * Load view changes from cache
   */
  private getChangesFromCache() {
    const result: string = this.cache?.getItem(this.key) ?? JSON.stringify([]);
    return JSON.parse(result) as ViewChangeType<Record<string, unknown>>[];
  }

  /**
   * Dump view changes to cache
   *
   * @param changes
   */
  private dumpChangesToCache(changes: ViewChangeType<Record<string, unknown>>[]) {
    this.cache?.setItem(this.key, JSON.stringify(changes));
  }

  // Service descructor
  ngOnDestroy(): void {
    for (const subscription of this._subscriptions ?? []) {
      subscription.unsubscribe();
    }
  }
}
