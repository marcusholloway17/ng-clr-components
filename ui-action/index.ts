import { UIActionAlertComponent } from './components';
import { UIActionIndicatorComponent } from './components/ui-action-indicator';
import { ReactiveUIStateController } from './reactive-ui-state-controller';
import { UIStateController } from './ui-state-controller';

export {
  ReactiveUIStateControllerType,
  UIStateControllerType,
  UIState,
} from './types';
export { UI_STATE_CONTROLLER, REACTIVE_UI_STATE_CONTROLLER } from './tokens';
export { UIStateModule } from './ui-state.module';
export {
  UIActionAlertComponent,
  UIActionIndicatorComponent,
} from './components';

// Export UI state controller providers
export {
  provideReactiveUIStateController,
  provideUIStateControllers,
} from './providers';

// Export UI state providers
export const UI_STATE_PROVIDERS = [
  ReactiveUIStateController,
  UIStateController,
] as const;

// Export UI State directives
export const UI_STATE_DIRECTIVES = [
  UIActionIndicatorComponent,
  UIActionAlertComponent,
] as const;
