import { BehaviorSubject, Observable } from 'rxjs';
import { ReactiveUIStateControllerType, UIActionState, UIState } from './types';
import { Injectable } from '@angular/core';

@Injectable()
export class ReactiveUIStateController
  implements ReactiveUIStateControllerType<UIActionState>
{
  // #region class properties
  private _uiState$ = new BehaviorSubject<UIState<UIActionState>>({
    performingAction: false,
  });
  public readonly uiState$: Observable<UIState<UIActionState>> =
    this._uiState$.asObservable();
  // #enregion class properties

  //
  startAction(): void {
    this._uiState$.next({
      performingAction: true,
      message: undefined,
      state: 'none',
    });
  }

  //
  endAction(message?: string, state?: UIActionState): void {
    this._uiState$.next({ performingAction: false, message, state });
  }
}
