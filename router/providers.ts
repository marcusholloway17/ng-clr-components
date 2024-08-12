import { Injector, Provider } from '@angular/core';
import {
  NavigateHandler,
  NavigateHandlerFactory,
  UrlChangesFactory,
} from './types';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  Scroll,
} from '@angular/router';
import { NAVIGATE_HANDLER_FACTORY, URL_CHANGES_FACTORY } from './tokens';
import { filter, map } from 'rxjs';

/**
 * Provides navigate handler implementation for angular default Router
 */
export function provideRouterNavigate() {
  return {
    provide: NAVIGATE_HANDLER_FACTORY,
    useFactory: (): NavigateHandlerFactory => {
      return (injector: Injector) => {
        return {
          call: (url: string | string[]) => {
            if (Array.isArray(url)) {
              return injector.get(Router)?.navigate(url);
            }
            if (url) {
              return injector.get(Router)?.navigateByUrl(url);
            }
            return;
          },
        } as NavigateHandler;
      };
    },
  } as Provider;
}

/**
 * Provides url change based on angular router events changes
 */
export function provideRouterChanges() {
  return {
    provide: URL_CHANGES_FACTORY,
    useFactory: (): UrlChangesFactory => {
      let previousUrl: string | null = null;
      return (injector: Injector) =>
        injector.get(Router)?.events.pipe(
          filter(
            (event) =>
              event instanceof Scroll ||
              event instanceof NavigationEnd ||
              event instanceof NavigationStart
          ),
          map((event) => {
            let nextUrl = null;
            if (
              event instanceof Scroll &&
              event.routerEvent &&
              event.routerEvent.url
            ) {
              nextUrl = event.routerEvent.url;
            }
            if (event instanceof NavigationStart && event.url) {
              nextUrl = event.url;
            }
            if (event instanceof NavigationEnd && event.url) {
              nextUrl = event.url;
            }
            const state = [previousUrl, nextUrl];

            // Set the previous url to equals the next for it to be checked on next event
            previousUrl = nextUrl;
            return state;
          }),
          filter(([_, next]) => next !== null && typeof next !== 'undefined'),
          map(([previous, next]) => ({ previous, next: next as string })),
          filter((change) => change.previous !== change.next)
        );
    },
    deps: [],
  } as Provider;
}
