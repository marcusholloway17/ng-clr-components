import {
  Inject,
  Injectable,
  Injector,
  OnDestroy,
  Optional,
} from '@angular/core';
import { BehaviorSubject, Subscription, tap } from 'rxjs';
import { URL_CHANGES_FACTORY, UrlChangesFactory } from '../router';

@Injectable({
  providedIn: 'root',
})
export class URLChanges implements OnDestroy {
  // #region Class property
  _state$ = new BehaviorSubject<string | null>(null);
  state$ = this._state$.asObservable();
  private _subscriptions: Subscription[] = [];
  // #endRegion Class property

  constructor(
    private injector: Injector,
    @Inject(URL_CHANGES_FACTORY)
    @Optional()
    private _urlChangesFactory?: UrlChangesFactory
  ) {
    if (this._urlChangesFactory) {
      const subscription = this._urlChangesFactory(this.injector)
        .pipe(
          tap((change) => {
            if (change.next) {
              this.setState(change.next);
            }
          })
        )
        .subscribe();
      this._subscriptions.push(subscription);
    }
  }

  //
  ngOnDestroy(): void {
    for (const suscription of this._subscriptions) {
      suscription?.unsubscribe();
    }
  }

  //
  private setState(url: string) {
    this._state$.next(url);
  }
}
