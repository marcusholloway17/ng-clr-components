import { Injector } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Type declaration for navigation action
 */
export type NavigateHandler = {
  /**
   * Navigates user to the provided url
   */
  call: (path: string | string[]) => unknown | Promise<unknown>;
};

/**
 * @internal
 * Factory function for navigate handler
 */
export type NavigateHandlerFactory = (injector: Injector) => NavigateHandler;

/**
 * URL changes observable listener
 */
export type UrlChanges = Observable<{ previous: string | null; next: string }>;

/**
 * @internal
 * Provides a factory function for url changes
 */
export type UrlChangesFactory = (injector: Injector) => UrlChanges;
