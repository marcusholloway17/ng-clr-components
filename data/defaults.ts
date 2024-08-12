import { ActionType } from './types';

/**
 * @internal
 * Default action definition
 */
export const defaultActions: ActionType[] = [
  'list',
  'create',
  'update',
  'delete',
];

/**
 * @internal
 * Default datagrid refresh state
 */
export const defaultDgState = {
  page: {
    size: 50,
    current: 1,
  },
  sort: {
    reverse: true,
    by: 'updated_at',
  },
};
