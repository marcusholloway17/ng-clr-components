import { Injectable, OnDestroy } from '@angular/core';
import {
  StateChangesListener,
  UIActionState,
  UIState,
  UIStateControllerType,
} from './types';

@Injectable()
export class UIStateController
  implements UIStateControllerType<UIActionState>, OnDestroy
{
  private _uiState: UIState<UIActionState> = {
    performingAction: false,
  };
  private _listeners: StateChangesListener<UIActionState>[] = [];
  get uiState() {
    return this._uiState;
  }

  private setState(
    value:
      | Partial<UIState<UIActionState>>
      | ((state: UIState<UIActionState>) => UIState<UIActionState>)
  ) {
    const _setState =
      typeof value === 'function' && value !== null
        ? value
        : (state: UIState<UIActionState>) => ({ ...state, ...value });

    // Update the UI state object
    this._uiState = _setState(this._uiState);

    // Notify all listeners
    for (const listener of this._listeners) {
      if (listener) {
        listener(this._uiState);
      }
    }
  }

  addListener(listener: StateChangesListener<UIActionState>): void {
    this._listeners.push(listener);
  }

  removeListener(listener: StateChangesListener<UIActionState>): void {
    const _index = this._listeners.findIndex(
      (_listener) => _listener === listener
    );
    if (_index !== -1) {
      this._listeners.splice(_index, 1);
    }
  }

  //
  startAction(): void {
    this.setState({ performingAction: true });
  }

  //
  endAction(message?: string, state?: UIActionState): void {
    this.setState({ performingAction: false, message, state });
  }

  ngOnDestroy(): void {
    for (const listener of this._listeners) {
      this.removeListener(listener);
    }
  }
}
