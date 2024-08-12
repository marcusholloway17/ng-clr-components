import { InjectionToken } from '@angular/core';
import { Link } from './types';
import { Observable } from 'rxjs';

/**
 * Provides application links
 */
export const APP_LINKS = new InjectionToken<Observable<Link[]>>(
  'Application links provider token'
);
