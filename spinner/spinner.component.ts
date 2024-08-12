import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'ngx-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  // #region Component inputs
  @Input() size: 'small' | 'medium' = 'medium';
  @Input() basic: boolean = true;
  // #region Component inputs

  get cssClass() {
    return this.size
      ? {
          [this.size]: true,
          ['spinner-basic']: this.basic ? true : false,
          ['spinner']: this.basic ? false : true,
        }
      : {
          ['spinner-basic']: this.basic ? true : false,
          ['spinner']: this.basic ? false : true,
        };
  }
}
