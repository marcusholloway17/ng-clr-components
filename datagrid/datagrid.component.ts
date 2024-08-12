import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import {
  PaginateResult,
  ProjectPaginateQueryParamType,
} from '@azlabsjs/ngx-clr-smart-grid';
import { useQuery } from '@azlabsjs/ngx-query';
import {
  catchError,
  debounceTime,
  map,
  Observable,
  OperatorFunction,
  Subject,
  Subscription,
  tap,
  throwError,
} from 'rxjs';
import { GridDataQueryProvider } from './datagrid.query.service';
import { defaultPaginateQuery } from './defaults';
import {
  DataGridStateType,
  PipeTransformType,
  RestQueryType,
  SearchableGridColumnType,
} from './types';
import { Intercept, NextCallback, usePaginateActionPipeline$ } from './rx';
import { DATAGRID_CONFIG } from './tokens';
import { QueryState, queryResult } from '@azlabsjs/rx-query';
import { remove, parseSearchDateValue, replace } from './helpers';

const _defaultState = {
  placeholder: undefined as string | undefined,
  performingAction: false as boolean,
};
type StateType = typeof _defaultState;
type SetStateParamType<T> = ((state: T) => T) | Partial<T>;

@Component({
  selector: 'ngx-datagrid',
  templateUrl: './datagrid.component.html',
  styles: [
    `
      .dg-header-container {
        margin: 10px 0 0 0;
      }
      :host ::ng-deep .row.inactive {
        background-color: var(--row-inactive, #cacaca);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatagridComponent implements OnInit, OnDestroy, OnChanges {
  // #region Component inputs
  @Input('page-size-options') sizeOptions = this.gridConfig
    ?.pageSizeOptions ?? [20, 50, 100, 150];
  @Input('page-size') pageSize = this.gridConfig?.pageSize ?? 50;
  @Input('overflow') overflowRef!: TemplateRef<any> | undefined;
  @Input('action-bar') actionBarRef!: TemplateRef<any> | undefined;
  @Input('detail-pane') detailPaneRef!: TemplateRef<any> | undefined;
  @Input('loading-text') loadingtext = 'Loading data, please wait ...';
  @Input('error-text') errorText =
    "We couldn't load data due to request error ...";
  @Input() placeholder = "We couldn't find any data!";
  @Input() url!: string;
  @Input() columns: SearchableGridColumnType[] = [];
  @Input() query: RestQueryType | undefined;
  @Input() filters: { property: string; value: unknown }[] = [];
  @Input() intercept!:
    | Intercept<ProjectPaginateQueryParamType, PaginateResult<unknown>>
    | undefined;
  @Input() loading!: boolean;
  @Input('state') dgState: ProjectPaginateQueryParamType = defaultPaginateQuery;
  @Input('search-value') search!: string | null | undefined;
  @Input('column-title-transform') transformColumnTitle!:
    | PipeTransformType
    | PipeTransformType[];
  @Input() selectable!: boolean;
  @Input('class') cssClass?: string;
  @Input('single-selection') singleSelection!: boolean;
  @Input('row-class') rowClass!: string | ((element: any) => string);
  // #endregion Component inputs

  // #region Component outputs
  @Output('detail-change') detailChange = new EventEmitter<unknown>();
  @Output('selected-change') selectedChange = new EventEmitter<unknown>();
  @Output('cached-query') cachedQuery = new EventEmitter<QueryState>();
  @Output('refresh-grid') refreshGrid = new EventEmitter<boolean>();
  @Output() dgStateChange = new EventEmitter<ProjectPaginateQueryParamType>();
  @Output() dgItemClick = new EventEmitter<unknown>();
  // #endregion Component outputs

  // #region Component properties / states
  private _dgChanges$ = new Subject<ProjectPaginateQueryParamType>();
  dgState$!: Observable<
    Required<
      PaginateResult<{
        [k: string]: any;
      }>
    >
  >;
  private _search$ = new Subject<string | undefined | null>();
  private subscriptions: Subscription[] = [];

  get overflow() {
    return typeof this.overflowRef !== 'undefined' && this.overflowRef !== null;
  }
  get detailed() {
    return (
      typeof this.detailPaneRef !== 'undefined' && this.detailPaneRef !== null
    );
  }

  _state: StateType = _defaultState;
  get state() {
    return this._state;
  }
  // #endregion Component properties / states

  /**
   * Creates an angular component instance
   */
  constructor(
    private queryProvider: GridDataQueryProvider,
    private changesRef: ChangeDetectorRef,
    @Inject(DATAGRID_CONFIG) @Optional() private gridConfig?: DataGridStateType
  ) {
    // #region Handle search query
    const subscription = this._search$
      .asObservable()
      .pipe(
        debounceTime(500),
        map((value) =>
          value
            ? this.columns
                .filter((column) => true === Boolean(column.searcheable))
                .map((column) => ({
                  property: column.field ?? column.label,
                  value,
                }))
            : []
        ),
        map((filters) => ({
          page: {
            current: 1,
            size:
              this.dgState.page?.size ??
              this.pageSize ??
              defaultPaginateQuery.page?.size,
          },
          filters,
        })),
        tap((query) => this._dgChanges$.next(query))
      )
      .subscribe();
    // #endregion Handle search query
    this.subscriptions.push(subscription);
  }

  ngOnInit(): void {
    this.dgState$ = this._dgChanges$.pipe(
      tap(() =>
        this.setState((state) => ({
          ...state,
          performingAction: true,
          placeholder: this.loadingtext,
        }))
      ),
      map((query) => ({
        ...query,
        filters: this.prepareSearchFilters([
          ...(this.query?._filters ?? []),
          ...this.filters,
          ...(query?.filters ?? []),
        ]),
      })),
      debounceTime(200),
      usePaginateActionPipeline$(
        this.getIntercept(),
        (query) =>
          useQuery(
            this.queryProvider,
            this.url,
            query,
            [],
            replace(
              replace(
                replace(
                  remove(this.query ?? {}, '_filters'),
                  '_excepts',
                  '_hidden[]',
                  (value) => value ?? []
                ),
                '_columns',
                '_columns[]',
                (value) => value ?? ['*']
              ),
              '_query',
              '_query',
              (value) => JSON.stringify(value ?? {})
            )
          ).pipe(
            tap((value: QueryState) =>
              this.cachedQuery.emit(value)
            ) as OperatorFunction<unknown, QueryState>,
            queryResult()
          ) as Observable<PaginateResult<unknown>>
      ),
      map((result) => {
        result = result ?? { data: [], total: 0 };
        const _result = Array.isArray(result)
          ? { data: result, total: result.length }
          : result;
        return {
          ..._result,
          data: _result?.data ?? [],
          total: _result?.total ?? _result?.data.length,
        } as Required<PaginateResult<{ [k: string]: any }>>;
      }),
      tap((result) =>
        this.setState((state) => ({
          ...state,
          performingAction: false,
          placeholder:
            result.total && result.total === 0 ? this.placeholder : undefined,
        }))
      ),
      catchError((error) => {
        this.setState((state) => ({
          ...state,
          performingAction: false,
          placeholder: this.errorText,
        }));
        return throwError(() => error);
      })
    );
  }

  // Listen for changes to trigger request
  ngOnChanges(changes: SimpleChanges): void {
    if ('url' in changes || 'query' in changes || 'filters' in changes) {
      this.onDgRefresh();
    }

    const dgStateChanges =
      'dgState' in changes &&
      changes['dgState'].currentValue !== changes['dgState'].previousValue;
    if (dgStateChanges) {
      this.dgRefreshListener(this.dgState);
    }

    const searchChanges =
      'search' in changes &&
      changes['search'].previousValue !== changes['search'].currentValue;
    if (searchChanges) {
      this._search$.next(this.search);
    }
  }

  // Listen for datagrid refresh event
  dgRefreshListener(event: ProjectPaginateQueryParamType) {
    // Emit the datagrid state changes
    this.dgStateChange.emit(event);
    this._dgChanges$.next(event);
  }

  onDgRefresh() {
    this.refreshGrid.emit(true);
  }

  private setState(value: SetStateParamType<StateType>) {
    const _callback =
      typeof value === 'function'
        ? value
        : (_state: StateType) => ({ ...this.state, ...value });

    this._state = _callback(this._state);
    this.changesRef!.markForCheck();
  }

  private getIntercept() {
    return typeof this.intercept !== 'undefined' && this.intercept !== null
      ? this.intercept
      : (traveler: any, next$: NextCallback<any, any>) => {
          return next$(traveler);
        };
  }

  /**
   * Prepares search query filters
   */
  private prepareSearchFilters(
    queries: { property: string; value: unknown }[]
  ) {
    const queryFilters: { property: string; value: unknown }[] = [];
    for (const query of queries) {
      const { value, property } = query;
      const column = this.columns.find(
        (value) =>
          value.field === query.property || value.label === query.property
      );
      if (!column) {
        queryFilters.push(query);
        continue;
      }
      let _value =
        column.searcheable && column.search?.type === 'date'
          ? parseSearchDateValue(String(value))
          : value;
      _value =
        column.searcheable && column.search?.flexible
          ? `${_value}`
          : `&&:${_value}`;
      queryFilters.push({ property, value: _value });
    }
    return queryFilters;
  }

  onDgItemClick(event: unknown) {
    this.dgItemClick.emit(event);
  }

  //
  ngOnDestroy(): void {
    // TODO: Do referenced resource cleanup
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
