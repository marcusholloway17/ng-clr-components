import { ProjectPaginateQueryParamType } from '@azlabsjs/ngx-clr-smart-grid';

/**
 * Default datagrid paginate query state
 */
export const defaultPaginateQuery: ProjectPaginateQueryParamType = {
    page: {
      size: 50,
      current: 1,
    },
    sort: {
      reverse: true,
      by: "updated_at",
    },
  };
  