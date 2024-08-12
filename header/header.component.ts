import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Inject,
  Injector,
  Input,
  Optional,
  TemplateRef,
} from '@angular/core';
import { Link } from '../header-links';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DROPDOWN_DIRECTIVES } from './dropdown-link';
import {
  HEADER_ACTIONS_FACTORY,
  HeaderAction,
  HeaderActionsFactory,
} from '../header-actions';
import { Observable, of } from 'rxjs';
import { AppendActionsPipe } from './append-actions.pipe';

// TODO: Move logout dependencies to another component

@Component({
  standalone: true,
  imports: [
    ...DROPDOWN_DIRECTIVES,
    CommonModule,
    RouterModule,
    AppendActionsPipe,
  ],
  selector: 'ngx-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  // #region Component projected contents
  @ContentChild('actions') actionsRef!: TemplateRef<unknown>;
  @ContentChild('brandingTemplate') brandingTemplate!: TemplateRef<unknown>;
  @ContentChild('linkTemplate') linkTemplate!: TemplateRef<unknown>;
  @ContentChild('navTemplate') navTemplate!: TemplateRef<unknown>;
  @ContentChild('navText') navTextRef!: TemplateRef<unknown>;
  // #endregion Component projected contents

  // #region Component inputs
  @Input() links: Link[] | null = [];
  @Input('class') cssClass!: string | undefined;
  @Input('company') company!: string;
  @Input('module') module!: string;
  @Input() actions: HeaderAction[] = [];
  // #endregion Component inputs

  // #region Component internal properties
  actions$!: Observable<HeaderAction[]>;
  // #endregion Component internal properties

  // Class constructor
  constructor(
    private injector: Injector,
    @Optional()
    @Inject(HEADER_ACTIONS_FACTORY)
    private headerActions?: HeaderActionsFactory
  ) {
    this.actions$ = this.headerActions
      ? this.headerActions(this.injector)
      : of([]);
  }
}
