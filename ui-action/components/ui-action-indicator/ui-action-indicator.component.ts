import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  Optional,
} from '@angular/core';
import { UI_STATE_CONTROLLER } from '../../tokens';
import { UIActionState, UIState, UIStateControllerType } from '../../types';
import { CommonModule } from '@angular/common';
import SPINNER_DIRECTIVES from '../../../spinner';

@Component({
  standalone: true,
  imports: [CommonModule, ...SPINNER_DIRECTIVES],
  selector: 'ngx-action-indicator',
  templateUrl: './ui-action-indicator.component.html',
  styleUrls: ['./ui-action-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIActionIndicatorComponent implements OnDestroy {
  // #region Component properties
  private _uiState: UIState<UIActionState> = {
    performingAction: false,
  };
  get uiState() {
    return this._uiState;
  }
  // #endregion Component properties

  // #region Component inputs
  @Input() size: 'small' | 'medium' = 'medium';
  @Input() basic: boolean = true;
  // #region Component inputs

  // Class constructor
  constructor(
    @Inject(UI_STATE_CONTROLLER)
    public readonly controller: UIStateControllerType,
    @Optional() private _detectorRef?: ChangeDetectorRef
  ) {
    this.controller.addListener(this.setState.bind(this));
  }

  // Set component state
  setState(state: UIState<UIActionState>) {
    this._uiState = state;
    this._detectorRef?.markForCheck();
  }

  // Component destructor
  ngOnDestroy(): void {
    this.controller.removeListener(this.setState.bind(this));
  }

  /**
   * Trigger the ui to an indicator of an ongoing action
   */
  startAction(): void {
    this.controller.startAction();
  }

  /**
   * Trigger the UI rederer to remove action indicator element
   */
  endAction(message?: string, state?: any): void {
    this.controller.endAction(message, state);
  }
}
