import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Injector,
  Input,
  OnDestroy,
  Optional,
  Output,
} from '@angular/core';
import { UILink } from './types';
import { Subscription, tap } from 'rxjs';
import { URLChanges } from './url-change.service';
import { NAVIGATE_HANDLER_FACTORY, NavigateHandlerFactory } from '../router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { DropdownModule } from '@azlabsjs/ngx-dropdown';
import { UILinksPipe, SublinksPipe } from './pipes';

@Component({
  standalone: true,
  imports: [CommonModule, DropdownModule, UILinksPipe, SublinksPipe],
  selector: 'ngx-header-links',
  templateUrl: './header-links.component.html',
  styleUrls: ['./header-links.component.scss'],
})
export class HeaderLinksComponent implements OnDestroy, AfterViewInit {
  // #region Component inputs
  @Input('icon-height') height: number = 36;
  @Input('icon-width') width: number = 36;
  @Input() links: UILink[] = [];
  /**
   * Before update url function controls wether the url should be updated by the internal router
   * If function returns false, internal router does not update the url, else it updates the url
   */
  @Input() beforeUpdateUrl!: (value: UILink) => boolean;
  // #endregion Component inputs

  // #region Component outputs
  @Output() linkClick = new EventEmitter<UILink>();
  @Output() urlChange = new EventEmitter<string>();
  // #endregion Component outputs

  // #region Component internal properties
  private _subscriptions: Subscription[] = [];
  currentUrl!: string;
  // #endregion Component internal properties

  constructor(
    private injector: Injector,
    private urlChanges: URLChanges,
    @Inject(NAVIGATE_HANDLER_FACTORY)
    @Optional()
    private navigateFactory?: NavigateHandlerFactory,
    @Optional()
    @Inject(DOCUMENT)
    private document?: Document
  ) {}

  //
  ngAfterViewInit(): void {
    const subscription = this.urlChanges.state$
      .pipe(
        tap((url) => {
          if (url) {
            this.currentUrl = url;
            this.urlChange.emit(url);
          }
        })
      )
      .subscribe();

    this._subscriptions.push(subscription);
  }

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

    if (this.navigateFactory) {
      const _beforeUpdateUrl =
        this.beforeUpdateUrl ??
        (() => {
          return true;
        });
      if (_beforeUpdateUrl(value)) {
        this.navigateFactory(this.injector).call(value.href as string);
      }
    }

    // We still emit the clicked element for user to handle the click action
    this.linkClick.emit(value);
  }

  ngOnDestroy(): void {
    for (const suscription of this._subscriptions) {
      suscription?.unsubscribe();
    }
  }
}
