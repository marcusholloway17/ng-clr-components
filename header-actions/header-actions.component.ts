import {
  Component,
  ContentChild,
  Inject,
  Injector,
  Input,
  Optional,
  TemplateRef,
} from '@angular/core';
import { HeaderAction } from './types';
import { NAVIGATE_HANDLER_FACTORY, NavigateHandlerFactory } from '../router';
import { CommonModule } from '@angular/common';
import { DropdownModule } from '@azlabsjs/ngx-dropdown';

@Component({
  imports: [CommonModule, DropdownModule],
  standalone: true,
  selector: 'ngx-header-actions',
  templateUrl: './header-actions.component.html',
  styleUrls: ['./header-actions.component.scss']
})
export class HeaderActionsComponent {
  // #region Component inputs
  @Input() actions: HeaderAction[] = [];
  // #endregion Compoennt inputs

  // #region Component children
  @ContentChild('toggle') toggleRef!: TemplateRef<unknown>;
  // #endregion Component children

  constructor(
    private injector: Injector,
    @Inject(NAVIGATE_HANDLER_FACTORY)
    @Optional()
    private navigateFactory?: NavigateHandlerFactory
  ) {}

  onItemClicked(event: Event, item: HeaderAction) {
    const { fn } = item;

    // Case fn property of the header action is a string we call the navigate handler
    // on the string value
    if (typeof fn === 'string') {
      if (!this.navigateFactory) {
        console.error('No navigate handler factory is provided!');
        return event?.preventDefault();
      }
      return this.navigateFactory(this.injector).call(fn);
    }

    // Case the provided fn property is javascript function we call the function with the injector as parameter
    if (typeof fn === 'function' && fn !== null) {
      fn(this.injector);
    }

    return event?.preventDefault();
  }
}
