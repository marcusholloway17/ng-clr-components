import { InjectionToken, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { HeaderAction } from './types';

/**
 * Header Action Factory injection Token
 */
export const HEADER_ACTIONS_FACTORY = new InjectionToken<
  (injector: Injector) => Observable<HeaderAction[]>
>('Header Action Factory injection Token');
