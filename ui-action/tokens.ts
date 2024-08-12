import { InjectionToken } from '@angular/core';
import { ReactiveUIStateControllerType, UIStateControllerType } from './types';

/**
 * UI state controller injection token
 */
export const UI_STATE_CONTROLLER = new InjectionToken<UIStateControllerType>(
  'UI state controller provider type definition'
);

/**
 * Reactive UI state controller injection token
 */
export const REACTIVE_UI_STATE_CONTROLLER =
  new InjectionToken<ReactiveUIStateControllerType>(
    'Reactive UI state controller provider type definition'
  );
