import { HeaderActionsComponent } from './header-actions.component';

// Export standalone components
export const HEADER_ACTIONS_DIRECTIVES = [HeaderActionsComponent] as const;

export { HeaderAction, HeaderActionsFactory } from './types';
export { HEADER_ACTIONS_FACTORY } from './tokens';
export { provideHeaderActions } from './providers';
