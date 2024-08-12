import { Injector } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Header action UI type declaration
 */
export type HeaderAction = {
  label: string;
  /**
   * function exectuted when user click on the header UI elmenent.
   * Case the fn is a string, the component trigger a navigate action by default, to the
   * provided path else, it call the fn as function
   */
  fn: string | ((injector: Injector) => unknown);

  /**
   * blank separated css classes to apply to the action UI element
   */
  cssClass?: string;
};

/**
 * Header actions factory instance
 */
export type HeaderActionsFactory = (
  injector: Injector | null
) => Observable<HeaderAction[]>;
