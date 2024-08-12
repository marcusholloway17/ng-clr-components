import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'ngx-viewport',
  template: ` <ng-content></ng-content>`,
  styles: [
    `
      :host {
        display: block;
        margin: 0;
        padding: 0;
      }
      :host(.fixed) {
        display: flex;
        flex-direction: column;
        height: 100vh;
        flex: 1 1 auto;
        background: var(--viewport-background, #fff);
      }

      :host(.fixed) ::ng-deep .viewport-content {
        flex: 1 1 auto;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        min-height: 0.05rem;
      }
    `,
  ],
})
export class ViewPortComponent {
  // #region Component inputs
  @Input() fixed: boolean = true;
  // #endregion Component inputs

  // #region Host attributes bindings
  @HostBinding('class.fixed') _fixedHost = this.fixed;
  // #endregion Host attributes bindings
}
