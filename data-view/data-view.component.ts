import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  ActionType,
  ConfigType,
  DataComponentModule,
  DataComponentType,
  StateType,
  ViewStateComponentType,
} from '../data';
import { UIStateControllerType, UI_STATE_CONTROLLER } from '../ui-action';
import {
  Observable,
  Subscription,
  distinctUntilChanged,
  filter,
  tap,
} from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { APP_LINKS, Link } from '../header-links';
import { CommonModule } from '@angular/common';
import { ViewportModule } from '../viewport';
import { VIEW_DIRECTIVES } from '../view';

/**
 * @internal
 */
type NullableEntityType = { id: string | number } | undefined | null;

/**
 * @internal
 */
type ActionResultType = {
  type: ActionType | string;
  payload: unknown;
  message?: string;
};

/**
 * @internal
 */
type ActionErrorType = {
  type: ActionType | string;
  err: unknown;
  message?: string;
};

@Component({
  standalone: true,
  imports: [
    CommonModule,
    DataComponentModule,
    ViewportModule,
    ...VIEW_DIRECTIVES
  ],
  selector: 'ngx-data-view',
  templateUrl: './data-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataViewComponent
  implements ViewStateComponentType, OnDestroy, AfterViewInit
{
  // #region Component inputs
  @Input() path!: string;
  @Input('no-padding') noPadding: boolean = true;
  @Input('no-header') noHeader: boolean = false;
  @Input('no-logout') noLogout: boolean = this.route.snapshot.data['noLogout']  ?? false;
  @Input() searchable: boolean = this.route.snapshot.data['searchable'] ?? true;
  @Input() branding: string = this.route.snapshot.data['branding'];
  @Input() name: string = this.route.snapshot.data['name'];
  // We resolve pages configuration from router resolve or data
  @Input() config: ConfigType = this.route.snapshot.data['config'];
  @Input() links: Link[] = this.route.snapshot.data['links'];
  // #endregion Component inputs

  // #region Component children
  @ContentChild('actions') actionsRef!: TemplateRef<unknown>;
  @ContentChild('header') headerRef!: TemplateRef<unknown>;
  @ContentChild('listView') listRef!: TemplateRef<unknown>;
  @ContentChild('gridView') gridRef!: TemplateRef<unknown>;
  @ContentChild('overflow') overflowRef!: TemplateRef<any>;
  @ContentChild('actionBar') actionBarRef!: TemplateRef<any>;
  @ContentChild('detailPane') detailPaneRef!: TemplateRef<any>;
  @ContentChild('beforeDetail') beforeDetailRef!: TemplateRef<unknown>;
  @ContentChild('afterDetail') afterDetailRef!: TemplateRef<unknown>;
  // #endregion List component children

  // #region Component outputs
  @Output() detailChange = new EventEmitter<unknown>();
  @Output() formError = new EventEmitter<unknown>();
  @Output() formReady = new EventEmitter<NullableEntityType>();
  @Output() formChanges = new EventEmitter<unknown>();
  @Output() stateChange = new EventEmitter<StateType>();
  // #endregion Components outputs

  // Child view reference
  @ViewChild('dataRef', { static: false }) dataViewRef!: DataComponentType;

  // #region Component internal properties
  private _subscriptions: Subscription[] = [];
  // #endregion Component internal properties

  // Class constructor
  constructor(
    @Inject(UI_STATE_CONTROLLER) private controller: UIStateControllerType,
    @Inject(APP_LINKS) @Optional() private _links$: Observable<Link[]>,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    // Case the links input does not have value, we load links from the global application link
    if (this._links$ && !this.links) {
      // Subscribe to the global application links and set the component links
      const subscription = this._links$
        .pipe(
          filter((value) => typeof value !== 'undefined' && value !== null),
          distinctUntilChanged(),
          tap((value) => (this.links = value))
        )
        .subscribe();
      this._subscriptions.push(subscription);
    }
  }

  onPerformingAction(value: boolean) {
    if (value) {
      return this.controller.startAction();
    }
    return this.controller.endAction();
  }

  onActionError(action: ActionErrorType) {
    this.controller.endAction(action.message ?? '', 'request-error');
  }

  onActionResult(action: ActionResultType) {
    this.controller.endAction(action?.message ?? '', 'success');
  }

  onFormReady(selected?: NullableEntityType) {
    this.formReady.emit(selected);
  }

  onDetailChange(event: unknown) {
    this.detailChange.emit(event);
  }

  onFormError(event: unknown) {
    this.formError.emit(event);
  }

  onFormChanges(event: unknown) {
    // TODO: Cache form changes using a cache class
    this.formChanges.emit(event);
  }

  onStateChanges(event: StateType) {
    this.stateChange.emit(event);
  }

  ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription?.unsubscribe();
    }
  }
}
