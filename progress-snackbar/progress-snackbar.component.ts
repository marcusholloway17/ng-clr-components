import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { PercentPipe } from './percent.pipe';

@Component({
  standalone: true,
  imports: [CommonModule, PercentPipe],
  selector: 'ngx-progress-snackbar',
  templateUrl: 'progress-snackbar.component.html',
  styleUrls: ['./progress-snackbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressSnackbarComponent {
  // #region Component input
  @Input() text: string = 'Uploading please wait...';
  @Input() total!: number | undefined | null;
  @Input() value!: number;
  @Input() autoclose: boolean = true;
  // #endregion Component input

  // #region Component properties
  _hidden: boolean = true;
  get hidden() {
    return this._hidden;
  }
  // #endregion Component properties

  // Class constuctor
  constructor(private changes: ChangeDetectorRef) {}

  // Apply a visibility none to the snackbar ui element
  // in order show it on the user interface
  show() {
    this._hidden = false;
    this.changes.markForCheck();
  }

  // Apply a visibility none to the snackbar ui element
  // in order to similate a hide on the user interface
  hide() {
    this._hidden = true;
    this.changes.markForCheck();
  }
}
