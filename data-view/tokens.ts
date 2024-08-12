import { InjectionToken } from '@angular/core';
import { ViewConfig } from './types';
import { Observable } from 'rxjs';

/**
 * @internal
 * Application data pages configurations injection token
 */
export const PAGE_CONFIGS = new InjectionToken<Observable<ViewConfig[]>>(
  'Application data pages configurations injection token'
);
