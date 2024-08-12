import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormConfigInterface,
  InputConfigInterface,
} from '@azlabsjs/smart-form-core';
import { Intercept } from '../types';
import { ReactiveFormComponentInterface } from '@azlabsjs/ngx-smart-form';
import { Observable, ObservableInput, firstValueFrom, tap, timer } from 'rxjs';
import { AsyncValidatorFn, ValidatorFn, AbstractControl } from '@angular/forms';
import { ControlsStateMap } from '@azlabsjs/ngx-smart-form/lib/angular/types';

@Component({
  selector: 'ngx-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css'],
})
export class DataFormComponent
  implements AfterViewInit, OnChanges, ReactiveFormComponentInterface
{
  // #region Component inputs
  @Input() form!: FormConfigInterface;
  @Input() url!: string | undefined;
  @Input() submitable: boolean = true;
  @Input('no-grid-layout') noGridLayout = false;
  @Input() intercept: Intercept<any, any> | undefined;
  @Input('submit-text') submitText: string = 'SUBMIT';
  @Input('cancel-text') cancelText: string = 'BACK';
  @Input('edit-text') editText: string = 'UPDATE';
  @Input() value!: unknown;
  @Input() autoupload: boolean = true;
  // #endregion Component inputs

  // #region Component outputs
  @Output() error = new EventEmitter<unknown>();
  @Output() ready = new EventEmitter<unknown>();
  @Output() changes = new EventEmitter<unknown>();
  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<unknown>();

  // #region Component children
  @ViewChild('formRef', { static: false })
  formComponent$!: ReactiveFormComponentInterface;
  // #endregion Component children

  // #region Component internal properties
  get formGroup() {
    return this.formComponent$?.formGroup;
  }
  // #endregion Component internal properties

  async ngAfterViewInit() {
    if (this.value) {
      await this.setFormValue(this.value);
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    if ('value' in changes) {
      this.setFormValue(this.value);
    }
  }

  async setFormValue<T = unknown>(value: T) {
    if (typeof value === 'object' && value !== null) {
      await firstValueFrom(
        timer(100).pipe(
          tap(() =>
            this.formComponent$?.setValue(value as Record<string, unknown>)
          )
        )
      );
    }
  }

  handleSubmit(event: unknown) {
    this.submit.emit(event);
  }

  handleChanges(event: unknown) {
    this.changes.emit(event);
  }

  async handleReady(event: unknown) {
    await firstValueFrom(timer(500).pipe(tap(() => this.ready.emit(event))));
  }

  handleError(error?: unknown) {
    this.error.emit(error);
  }

  handleCancel(event: Event) {
    this.cancel.emit();
    event?.stopPropagation();
    event?.preventDefault();
  }

  setValue(state: { [k: string]: unknown }): void {
    return this.formComponent$?.setValue(state);
  }

  addAsyncValidator(
    validator: AsyncValidatorFn,
    control?: string | undefined
  ): void {
    return this.formComponent$?.addAsyncValidator(validator, control);
  }

  addValidator(validator: ValidatorFn, control?: string | undefined): void {
    return this.formComponent$?.addValidator(validator, control);
  }

  controlValueChanges(name: string): Observable<unknown> {
    return this.formComponent$?.controlValueChanges(name);
  }

  getControlValue(name: string, _default?: any): unknown {
    return this.formComponent$?.getControlValue(name, _default);
  }

  setControlValue(control: string, value: any): void {
    this.formComponent$?.setControlValue(control, value);
  }

  disableControls(values: ControlsStateMap): void {
    this.formComponent$?.disableControls(values);
  }

  enableControls(values: ControlsStateMap): void {
    this.formComponent$?.enableControls(values);
  }

  addControl(name: string, control: AbstractControl<any, any>): void {
    this.formComponent$?.addControl(name, control);
  }

  getControl(name: string): AbstractControl<any, any> | undefined {
    return this.formComponent$?.getControl(name) ?? undefined;
  }

  onSubmit(event: Event): void | ObservableInput<void> {
    return this.formComponent$?.onSubmit(event);
  }

  setComponentForm(value: FormConfigInterface): void {
    return this.formComponent$?.setComponentForm(value);
  }

  setControlConfig(
    config?: InputConfigInterface | undefined,
    name?: string | undefined
  ): void {
    return this.formComponent$?.setControlConfig(config, name);
  }

  validateForm(): void {
    this.formComponent$?.validateForm();
  }

  reset(): void {
    this.formComponent$?.reset();
  }
}
