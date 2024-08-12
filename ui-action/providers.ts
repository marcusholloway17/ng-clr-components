import { Injector, Provider } from '@angular/core';
import { UIStateController } from './ui-state-controller';
import { REACTIVE_UI_STATE_CONTROLLER, UI_STATE_CONTROLLER } from './tokens';
import { ReactiveUIStateControllerType, UIStateControllerType } from './types';
import { ReactiveUIStateController } from './reactive-ui-state-controller';

/**
 * Provides UI state controller instance
 */
export function provideUIStateControllers(
  controller?: (injector: Injector) => UIStateControllerType
) {
  const _controller =
    controller ?? ((injector: Injector) => injector.get(UIStateController));
  return {
    provide: UI_STATE_CONTROLLER,
    useFactory: (injector: Injector) => {
      return _controller(injector);
    },
    deps: [Injector],
  } as Provider;
}

/**
 * Provides an observable based UI state controller instance
 */
export function provideReactiveUIStateController(
  controller?: (injector: Injector) => ReactiveUIStateControllerType
) {
  const _controller =
    controller ??
    ((injector: Injector) => injector.get(ReactiveUIStateController));
  return {
    provide: REACTIVE_UI_STATE_CONTROLLER,
    useFactory: (injector: Injector) => {
      return _controller(injector);
    },
    deps: [Injector],
  } as Provider;
}
