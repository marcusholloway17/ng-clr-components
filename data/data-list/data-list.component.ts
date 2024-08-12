import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { UIActionEventArgType, ConfigType, UIActionConfigType } from '../types';
import { QueryState } from '@azlabsjs/rx-query';

@Component({
  selector: 'ngx-clr-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataListComponent {
  // #region Component Inputs
  @Input('refresh-text') refreshText: string = 'refresh';
  @Input('gridView') gridViewRef!: TemplateRef<unknown>;
  @Input('overflow') overflow!: TemplateRef<any>;
  @Input('action-bar') actionBar!: TemplateRef<any> | undefined;
  @Input('detail-pane') detailPaneRef!: TemplateRef<any> | undefined;
  @Input('show-detail-pane') showDetailPane: boolean = false;
  @Input('no-padding') noPadding: boolean = true;
  @Input('actions') set actions(values: UIActionConfigType[]) {
    const _actionBarActions: UIActionConfigType[] = [];
    const _overflowActions: UIActionConfigType[] = [];
    if (values) {
      for (const action of values) {
        if (action.position === 'overflow') {
          _overflowActions.push(action);
          continue;
        }
        if (action.position === 'action-bar') {
          _actionBarActions.push(action);
          continue;
        }
      }
    }
    this._actionBarActions = _actionBarActions;
    this._overflowActions = _overflowActions;
  }
  @Input() config!: ConfigType;
  @Input() url!: string;
  @Input('dg-state') dgState!: unknown;
  @Input('search-value') search!: string | null | undefined;
  // #endregion Component Inputs

  // #region Component outputs
  @Output('detail-change') detailPaneChange$ = new EventEmitter<unknown>();
  @Output('cached-query') cachedQuery = new EventEmitter<QueryState>();
  @Output('dg-state-change') dgStateChange = new EventEmitter<unknown>();
  @Output('refresh-grid') refreshGrid = new EventEmitter<boolean>();
  @Output() action = new EventEmitter<UIActionEventArgType>();
  // #endregion Component outputs

  // #region Component properties
  _actionBarActions: UIActionConfigType[] = [];
  get actionBarActions() {
    return this._actionBarActions;
  }
  _overflowActions: UIActionConfigType[] = [];
  get overflowActions() {
    return this._overflowActions;
  }
  // #endregion Component properties

  handleDetailPaneChange(event: unknown) {
    this.detailPaneChange$.emit(event);
  }

  handleAction(event: Event, item: unknown, action: UIActionConfigType) {
    this.action.emit({ payload: item, action });
    event?.preventDefault();
    event?.stopPropagation();
  }

  handleActionBarAction(
    event: Event,
    values: unknown[],
    action: UIActionConfigType
  ) {
    this.action.emit({ payload: values, action });
    event?.preventDefault();
    event?.stopPropagation();
  }

  handleCachedQuery(query: QueryState) {
    this.cachedQuery.emit(query);
  }

  handleRefreshDatagrid(event: boolean) {
    this.refreshGrid.emit(event);
  }

  handleDgStateChanges(event: unknown) {
    this.dgStateChange.emit(event);
  }

  onDgItemClicked(
    event: unknown,
    handler?: (value: unknown) => void | Promise<void>
  ) {
    if (handler) {
      handler(event);
    }
  }
}
