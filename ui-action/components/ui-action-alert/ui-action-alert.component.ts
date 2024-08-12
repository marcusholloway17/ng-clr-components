import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  Optional,
} from '@angular/core';
import { UI_STATE_CONTROLLER } from '../../tokens';
import { UIActionState, UIState, UIStateControllerType } from '../../types';
import { Subject, takeUntil, timer } from 'rxjs';
import { CommonModule } from '@angular/common';

const ALERT_TYPES_DICT: Partial<
  Record<UIActionState, 'warning' | 'success' | 'danger' | 'default'>
> = {
  error: 'danger',
  success: 'success',
  exception: 'danger',
  'request-error': 'danger',
  none: 'default',
  'bad-request': 'warning',
};

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'ngx-action-alert',
  templateUrl: './ui-action-alert.component.html',
  styleUrls: ['./ui-action-alert.component.css'],
  animations: [
    trigger('fadeInOutSlide', [
      transition(':enter', [
        style({ transform: 'translateX(250px)', opacity: 0 }),
        animate(
          '200ms ease-in',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('200ms', style({ transform: 'translateX(250px)', opacity: 0 })),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIActionAlertComponent implements OnDestroy {
  @HostBinding('class.action-alert-container') actionAlertContainer = true;
  //#region Component input properties
  @Input() closable: boolean = true;
  @Input() light: boolean = false;
  @Input('app-level') appLevel = true;
  //#endregion Component input properties

  // #region Component properties
  private _destroyTimer$ = new Subject<void>();
  // #endregion Component properties

  _state = {
    performingAction: false as boolean,
    message: undefined as string | undefined,
    cssClass: {} as Record<string, boolean>,
    status: undefined as undefined | UIActionState,
  };

  get state() {
    return this._state;
  }

  constructor(
    @Inject(UI_STATE_CONTROLLER)
    public readonly controller: UIStateControllerType,
    @Optional() private _detectorRef?: ChangeDetectorRef
  ) {
    this.controller.addListener(this.setState.bind(this));
  }

  /**
   * Set ui state property value
   */
  setState(state: UIState<UIActionState>) {
    // Case the state changes, we stop the timer that closes the alert component
    this._destroyTimer$.next();

    // Then we build alert state object
    const cssClass: Record<string, boolean> = {
      light: this.light,
      ['app-level']: Boolean(this.appLevel),
    };
    const _status = ALERT_TYPES_DICT[state.state ?? 'none'];
    if (_status) {
      cssClass[_status] = true;
    }

    this._state = {
      message: state.message,
      status: state.state,
      cssClass,
      performingAction: state.performingAction,
    };

    // We only create the close timer if the alert component is to be shown
    if (
      !this.state.performingAction &&
      !!state.message &&
      !!this.state.status &&
      this.state.status !== 'none'
    ) {
      timer(5000)
        .pipe(takeUntil(this._destroyTimer$))
        .subscribe(() => this.onCloseAlert());
    }

    this._detectorRef?.markForCheck();
  }

  onCloseAlert(event?: Event) {
    this.controller.endAction();
    event?.preventDefault();
    event?.stopPropagation();
  }

  ngOnDestroy(): void {
    this.controller.removeListener(this.setState.bind(this));
  }
}
