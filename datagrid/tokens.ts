import { InjectionToken } from '@angular/core';
import { PagingConfig } from './types';

/**
 * Injection token declaration
 */
export const DATAGRID_CONFIG = new InjectionToken<PagingConfig>(
  'Pagination Parameters configurations Provider'
);
