import { InjectionToken } from '@angular/core';
import { NavigateHandlerFactory, UrlChanges, UrlChangesFactory } from './types';

/**
 * @internal
 *
 * Observable of router url changes
 */
export const URL_CHANGES_FACTORY = new InjectionToken<UrlChangesFactory>(
  'URL changes injection token'
);

/**
 * @internal
 *
 * Observable of router url changes
 */
export const URL_CHANGES = new InjectionToken<UrlChanges>(
  'URL changes injection token'
);

/**
 * @internal
 * Injection Token to navigate handler factory
 */
export const NAVIGATE_HANDLER_FACTORY =
  new InjectionToken<NavigateHandlerFactory>(
    'Injection Token to navigate handler factory'
  );
