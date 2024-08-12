import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ConstraintFn, ErrorType, GridCellType, RecordType } from '../types';
import { FormsModule } from '@angular/forms';
import { CellModeType, NavigationDirectionType } from './types';
import PIPES from '../pipes';
import { NgxCommonModule } from '@azlabsjs/ngx-common';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule, NgxCommonModule, ...PIPES],
  selector: 'ngx-grid-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridCellComponent implements OnChanges {
  // #region Component inputs
  @Input() config!: GridCellType;
  @Input() mode: CellModeType = 'edit';
  _value!: string | unknown;
  @Input() set value(arg: string | unknown) {
    this._state = arg;
    this._value = arg;
  }
  get value() {
    return this._value;
  }
  @Input() record!: RecordType;
  @Input() errors!: ErrorType[] | undefined | null;
  @Input() textViewRef!: TemplateRef<any>;
  @Input() optionViewRef!: TemplateRef<any>;
  // #endregion Component inputs

  // #region Component outputs
  @Output() valueChange = new EventEmitter<{
    name: string;
    value: unknown;
    constraints?: ConstraintFn[];
  }>();
  @Output() modeChange = new EventEmitter<CellModeType>();
  @Output() selectionChange = new EventEmitter<{
    mode: CellModeType;
    index: number;
    direction: NavigationDirectionType;
  }>();
  // #endregion Component outputs

  // #region Component properties
  _state!: string | unknown;
  get state() {
    return this._state;
  }
  // #endregion Component properties

  @ViewChild('input', { static: false, read: ElementRef })
  inputRef!: ElementRef<unknown>;

  // Class constructor
  constructor(private changes: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('mode' in changes && changes['mode'].currentValue === 'edit') {
      const timeout = setTimeout(() => {
        (this.inputRef?.nativeElement as HTMLInputElement)?.focus();
        clearTimeout(timeout);
      }, 100);
    }
  }

  onKeyPress(event: KeyboardEvent, _type: string): void {
    if (_type === 'number') {
      if (!/[0-9\+\-\ ]/.test(event.key.replace(/key/i, '').trim())) {
        event.preventDefault();
      }
    }
  }

  onBlur(event: Event, config: GridCellType) {
    this.modeChange.emit('view');
    // We only emit if the value of the cell changes
    // Case the value property is null or undefined, we treat it like and empty
    // string for easy comparison between strings
    const value = this.value ?? '';
    const state = this._state ?? '';
    if (state !== value) {
      this.valueChange.emit({
        value: this._state,
        name: this.config.column.name,
        constraints: config?.column?.constraints,
      });
    }
    // Prevent default event handlers
    event?.preventDefault();
  }

  onKeyDown(event: KeyboardEvent, config: GridCellType) {
    if (config.frozen) {
      return;
    }

    if (event.code.toUpperCase() === 'TAB') {
      (this.inputRef?.nativeElement as HTMLInputElement)?.blur();
      this.selectionChange.emit({
        mode: 'view',
        index: this.config.index,
        direction: event?.shiftKey ? 'backward' : 'forward',
      });
      // Prevent default event handlers
      event?.preventDefault();
    }

    if (event.code.toUpperCase() === 'ENTER') {
      (this.inputRef?.nativeElement as HTMLInputElement)?.blur();
      this.selectionChange.emit({
        mode: 'view',
        index: this.config.index,
        direction: event?.shiftKey ? 'top' : 'down',
      });
      // Prevent default event handlers
      event?.preventDefault();
    }
  }

  onChange(value: any) {
    this._state = value;
    this.changes?.detectChanges();
  }
}
