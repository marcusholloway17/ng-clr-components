import {
  Component,
  HostBinding,
  Inject,
  Injector,
  Input,
  Optional,
  TemplateRef,
} from '@angular/core';
import { UILink } from '../../header-links';
import { CommonModule, DOCUMENT } from '@angular/common';
import { DropdownModule } from '@azlabsjs/ngx-dropdown';
import { Router, RouterModule } from '@angular/router';

@Component({
  imports: [CommonModule, DropdownModule, RouterModule],
  standalone: true,
  selector: 'ngx-header-dropdown-link',
  templateUrl: './header-dropdown-link.component.html',
})
export class HeaderDropdownLinkComponent {
  // #region Component inputs
  @HostBinding('class.links__nav-link') navlink = true;
  @Input() label!: string;
  @Input() links!: UILink[];
  @Input('navText') navTextRef!: TemplateRef<unknown>;
  // #endregion Component inputs

  constructor(
    private router: Router,
    private injector: Injector,
    @Optional()
    @Inject(DOCUMENT)
    private document?: Document
  ) {}

  onNavigate(event: Event, value: UILink) {
    event?.preventDefault();
    if (typeof value.href === 'function') {
      return value.href(this.injector);
    }

    const isValidURL = (url: string) => {
      try {
        const _url = new URL(url);
        return typeof _url.protocol !== 'undefined' && _url.protocol !== null;
      } catch {
        return false;
      }
    };

    if (isValidURL(value.href as string)) {
      const { defaultView } = this.document ?? {};
      const _window = defaultView ?? window;
      _window.location.href = value.href;
      return;
    }

    return this.router.navigateByUrl(value.href);
  }
}
