import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import {
  PaginateResult,
  ProjectPaginateQueryParamType,
  QueryFiltersType,
} from '@azlabsjs/ngx-clr-smart-grid';
import { ProvidesQuery } from '@azlabsjs/ngx-query';
import { QueryProviderType } from '@azlabsjs/rx-query';
import { Observable } from 'rxjs';
import { createDateQueryParamPipe, projectPaginateQuery } from './helpers';
import { DATAGRID_CONFIG } from './tokens';
import { DataGridStateType, RestQueryType } from './types';

@ProvidesQuery({
  observe: 'query',
  cacheTime: 300000,
})
@Injectable()
export class GridDataQueryProvider
  implements
    QueryProviderType<
      [
        string,
        ProjectPaginateQueryParamType,
        QueryFiltersType,
        Omit<RestQueryType, '_filters'> | undefined
      ]
    >
{
  private _gridConfig!: DataGridStateType;

  // Creates instance of the class
  constructor(
    private http: HttpClient,
    @Inject(DATAGRID_CONFIG) @Optional() gridConfig?: DataGridStateType
  ) {
    this._gridConfig = gridConfig ?? {
      pagination: { page: 'page', perPage: 'per_page' },
      sort: { order: 'order', by: 'by', ascending: '1', descending: '-1' },
    };
  }

  query<T>(
    path: string,
    project: ProjectPaginateQueryParamType,
    filters?: QueryFiltersType,
    params?: Omit<RestQueryType, '_filters'>
  ): Observable<PaginateResult<T>> {
    // Project the query parameter using the projection function
    let query = projectPaginateQuery(
      filters ?? [],
      createDateQueryParamPipe(),
      this._gridConfig
    )(project);

    // We append the column and hidden query parameters to the request params
    if (params) {
      query = { ...query, ...params };
    }
    return this.http.get(path, { params: query }) as Observable<
      PaginateResult<T>
    >;
  }
}
