import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { REACTIVE_UI_STATE_CONTROLLER, UI_STATE_CONTROLLER } from './tokens';
import { ReactiveUIStateControllerType, UIStateControllerType } from './types';
import { UIStateController } from './ui-state-controller';
import { ReactiveUIStateController } from './reactive-ui-state-controller';
import {
  UIActionAlertComponent,
  UIActionIndicatorComponent,
} from './components';

type ConfigType = {
  provideStateController?: (injector: Injector) => UIStateControllerType;
  provideReactiveStateController?: (
    injector: Injector
  ) => ReactiveUIStateControllerType;
};

@NgModule({
  imports: [UIActionIndicatorComponent, UIActionAlertComponent],
  exports: [UIActionIndicatorComponent, UIActionAlertComponent],
  providers: [],
})
export class UIStateModule {
  static forRoot(config?: ConfigType): ModuleWithProviders<UIStateModule> {
    const { provideReactiveStateController, provideStateController } =
      config ?? {};
    const _controller =
      provideStateController ??
      ((injector: Injector) => injector.get(UIStateController));

    const _reactiveController =
      provideReactiveStateController ??
      ((injector: Injector) => injector.get(ReactiveUIStateController));

    return {
      ngModule: UIStateModule,
      providers: [
        UIStateController,
        ReactiveUIStateController,
        {
          provide: UI_STATE_CONTROLLER,
          useFactory: (injector: Injector) => {
            return _controller(injector);
          },
          deps: [Injector],
        },
        {
          provide: REACTIVE_UI_STATE_CONTROLLER,
          useFactory: (injector: Injector) => {
            return _reactiveController(injector);
          },
          deps: [Injector],
        },
      ],
    };
  }
}
