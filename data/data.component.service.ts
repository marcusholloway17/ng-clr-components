import { Inject, Injectable } from '@angular/core';
import {
  Observable,
  catchError,
  from,
  isObservable,
  of,
  throwError,
} from 'rxjs';
import { actionPipeline$ } from './rx';
import {
  ActionConfigType,
  ActionHandler,
  CreateActionPayload,
  CustomActionConfigType,
  DeleteActionPayload,
  RequestClient,
  UpdateActionPayload,
} from './types';
import {
  CREATE_ACTION_HANDLER,
  DELETE_ACTION_HANDLER,
  REQUEST_CLIENT,
  UPDATE_ACTION_HANDLER,
} from './tokens';

@Injectable()
export class CustomActionHTTPHandler {
  /**
   * Class constructor
   */
  public constructor(@Inject(REQUEST_CLIENT) private http: RequestClient) {}

  /**
   * Handle custom action http handler
   */
  handle(
    url: string,
    event: unknown,
    action?: CustomActionConfigType,
    errorCallback?: (err: unknown) => void
  ) {
    // First we call provide a fallback implementation for
    // perpare url case not provided by the configuration
    const prepareUrl = action?.prepareUrl ?? ((_url) => _url);
    // The we call the prepare url on the provided url for the handler
    // to make sure that developper has the ability to change url
    const _url = prepareUrl(url, event);
    return of(event).pipe(
      actionPipeline$(
        action?.intercept ?? ((traveler, next$) => next$(traveler)),
        (traveler) =>
          from(this.http.request(_url, action?.method ?? 'GET', traveler))
      ),
      catchError((err) => {
        if (errorCallback) {
          errorCallback(err);
        }
        return throwError(() => err);
      })
    );
  }
}

@Injectable()
export class DataComponentService {
  /**
   * Creates data component CRUD service insance
   */
  constructor(
    @Inject(DELETE_ACTION_HANDLER)
    private delete$: ActionHandler<DeleteActionPayload, unknown>,
    @Inject(UPDATE_ACTION_HANDLER)
    private update$: ActionHandler<UpdateActionPayload, unknown>,
    @Inject(CREATE_ACTION_HANDLER)
    private create$: ActionHandler<CreateActionPayload, unknown>
  ) {}

  //
  create(
    url: string,
    event: unknown,
    action?: ActionConfigType,
    errorCallback?: (err: unknown) => void
  ) {
    return of(event).pipe(
      actionPipeline$(
        action?.intercept ?? ((traveler, next$) => next$(traveler)),
        (body) => {
          const result$ = this.create$.handle({ url, body });
          return isObservable(result$)
            ? (result$ as Observable<unknown>)
            : of(result$);
        }
      ),
      catchError((err) => {
        if (errorCallback) {
          errorCallback(err);
        }
        return throwError(() => err);
      })
    );
  }

  //
  update(
    url: string,
    id: number | string,
    event: unknown,
    action?: ActionConfigType,
    errorCallback?: (err: unknown) => void
  ) {
    return of(event).pipe(
      actionPipeline$(
        action?.intercept ?? ((traveler, next$) => next$(traveler)),
        (body) => {
          const result$ = this.update$.handle({ id, url, body });
          return isObservable(result$)
            ? (result$ as Observable<unknown>)
            : of(result$);
        }
      ),
      catchError((err) => {
        if (errorCallback) {
          errorCallback(err);
        }
        return throwError(() => err);
      })
    );
  }

  //
  delete(
    url: string,
    id: number | string,
    event: unknown,
    action?: ActionConfigType,
    errorCallback?: (err: unknown) => void
  ) {
    return of(event).pipe(
      actionPipeline$(
        action?.intercept ?? ((traveler, next$) => next$(traveler)),
        () => {
          const result$ = this.delete$.handle({ id, url });
          return isObservable(result$)
            ? (result$ as Observable<unknown>)
            : of(result$);
        }
      ),
      catchError((err) => {
        if (errorCallback) {
          errorCallback(err);
        }
        return throwError(() => err);
      })
    );
  }
}
