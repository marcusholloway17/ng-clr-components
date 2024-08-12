import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormsClient,
  FORM_CLIENT,
  FormComponentInterface,
  NgxSmartFormModule,
} from '@azlabsjs/ngx-smart-form';
import { FormConfigInterface } from '@azlabsjs/smart-form-core';
import { MODAL_DIRECTIVES, ModalElement } from '../modal';
import { Subscription, filter, of, tap } from 'rxjs';
import { NgxClrFormControlModule } from '@azlabsjs/ngx-clr-form-control';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NgxSmartFormModule,
    NgxClrFormControlModule,
    ...MODAL_DIRECTIVES,
  ],
  selector: 'ngx-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxFormModalComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  // #region Component inputs
  @Input() title!: string;
  @Input('no-grid-layout') noGridLayout!: boolean;
  @Input('form-id') formId!: string | number;
  @Input('submit-text') submitText!: string;
  @Input('cancel-text') cancelText!: string;
  @Input() opened: boolean = false;
  @Input() size: 'sm' | 'lg' | 'xl' = 'lg';
  @Input() closeable: boolean = true;
  @Input() public form!: FormConfigInterface | null;
  // #enregion Component inputs

  @ViewChild('modal', { static: false }) modalRef!: ModalElement | null;
  @ViewChild('formRef', { static: false })
  formRef!: FormComponentInterface | null;

  // #region Component internal property
  private _subscriptions: Subscription[] = [];
  // #endregion Component internal property

  // #region Component output
  @Output() submit = new EventEmitter<unknown>();
  @Output() ready = new EventEmitter<unknown>();
  @Output() error = new EventEmitter<unknown>();
  @Output() closed = new EventEmitter();
  // #endregion Component output

  // Class constructor
  constructor(
    @Inject(FORM_CLIENT) private client: FormsClient,
    private _ref?: ChangeDetectorRef | null
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('formId' in changes) {
      this.formEffect();
    }
  }

  ngAfterViewInit(): void {
    this.formEffect();
  }

  ngOnDestroy(): void {
    if (this._ref) {
      this._ref = null;
    }
    if (this._subscriptions) {
      for (const subscription of this._subscriptions) {
        subscription.unsubscribe();
      }
    }
  }

  formEffect() {
    if (this.formId) {
      const subscription = this.client
        .get(this.formId)
        .pipe(
          filter((form) => typeof form !== 'undefined' && form !== null),
          tap((form) => this.setState(form))
        )
        .subscribe();
      this._subscriptions.push(subscription);
    }
  }

  close() {
    this.modalRef?.close();
  }

  open() {
    this.modalRef?.open();
  }

  onSubmit(event: unknown) {
    this.submit.emit(event);
  }

  onError(error: unknown) {
    this.error.emit(error);
  }

  onModalOpenedChanged(event: boolean) {
    if (true === event) {
      return;
    }
    this.closed.emit();
    this.formRef?.reset();
  }

  onCancel(event?: Event) {
    this.formRef?.reset();
    this.close();
    //
    event?.preventDefault();
    event?.stopPropagation();
  }

  /**
   * Debugging method for registering to input value changes
   */
  controlValueChanges(name: string) {
    return this.formRef && this.formRef.getControl(name)
      ? this.formRef.controlValueChanges(name)
      : of();
  }

  getControl(name: string) {
    return this.formRef?.getControl(name);
  }

  onReady(event: unknown) {
    const timeout = setTimeout(() => {
      this.ready.emit(event);
      clearTimeout(timeout);
    }, 700);
  }

  private setState(form: FormConfigInterface) {
    this.form = form;
    this._ref?.detectChanges();
  }
}
