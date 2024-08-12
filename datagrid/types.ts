import { GridColumnType } from '@azlabsjs/ngx-clr-smart-grid';

/**
 * @internal
 */
export type PipeTransformType = string | ((value: any) => any) | undefined;

/**
 * Pagination parameter configuration type declaration
 */
export type PagingConfig = {
  page: string;
  perPage: string;
};

/**
 * @internal
 */
export type DataGridStateType = {
  pageSizeOptions?: number[];
  pageSize?: number;
  pagination: PagingConfig;
  sort?: Partial<{
    asQuery?: boolean;
    order: string;
    by: string;
    /**
     * Provides string used as value for ascending order
     */
    ascending: '1' | 'asc' | string;
    /**
     * Provides string used as value for descending order
     */
    descending: '-1' | 'desc' | string;
  }>;
};

/**
 * REST API Query type
 */
export type RestQueryType = {
  _columns?: string[];
  _excepts?: string[];
  _filters?: { property: string; value: unknown }[];
  _query?: { [k: string]: any };
};

/**
 * Type declaration for a grid column type with added searchable property
 */
export type SearchableGridColumnType = GridColumnType &
  (
    | {
        searcheable?: true;
        search?: {
          type?: 'text' | 'date';
          /**
           * Flexible property is use allow grid to control the operator use when performing
           * search. Case the search flexibility is true, an `or` query is send to the server
           * else an `and` query is send to the server
           */
          flexible: boolean;
        };
      }
    | { searcheable?: false }
  );

/**
 * Grid Config Type declaration template
 */
export type GridConfigType<T extends Function> = {
  url: string;
  datagrid: {
    columns: SearchableGridColumnType[];
    query: RestQueryType;
  };
  project: T;
};
