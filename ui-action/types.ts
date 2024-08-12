import { Observable } from 'rxjs';

export type UIActionState =
  | 'error'
  | 'success'
  | 'request-error'
  | 'bad-request'
  | 'exception'
  | 'none';

/**
 * A generic
 */
export type UIState<T> = {
  performingAction: boolean;
  message?: string;
  error?: unknown;
  state?: T;
};

/**
 * @internal
 */
export type StateChangesListener<T> = (state: UIState<T>) => void;

/**
 * @internal
 */
export type Callback = (...args: any) => unknown;

/**
 * Base UI state controller type declaration
 */
export type UIStateControllerBase<T extends UIActionState = UIActionState> = {
  /**
   * Trigger the ui to an indicator of an ongoing action
   */
  startAction(): void;

  /**
   * Trigger the UI rederer to remove action indicator element
   */
  endAction(message?: string, state?: T): void;
};

/**
 * UI state controller type declaration
 */
export type UIStateControllerType<T extends UIActionState = UIActionState> =
  UIStateControllerBase<T> & {
    /**
     * Add a listener that is executed when the ui controller changes state.
     *
     * **Note** This helps making the component that uses the controller reactive to ui state changes
     */
    addListener(listener: StateChangesListener<T>): void;

    /**
     * Remove a listener from the list of listeners
     */
    removeListener(listener: StateChangesListener<T>): void;
  };

/**
 * Reactive UI state controller that emit a stream of ui state changes
 */
export type ReactiveUIStateControllerType<
  T extends UIActionState = UIActionState
> = UIStateControllerBase<T> & {
  /**
   * UI state reactive property
   */
  uiState$: Observable<UIState<T>>;
};
