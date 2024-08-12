import { Observable, from } from 'rxjs';
import {
  ActionHandler,
  CreateActionPayload,
  DeleteActionPayload,
  RequestClient,
  UpdateActionPayload,
} from './types';
import { Inject, Injectable } from '@angular/core';
import { REQUEST_CLIENT } from './tokens';

/**
 * Delete Action handler class declaration
 */
@Injectable()
export class DeleteQueryActionHandler<TResult>
  implements ActionHandler<DeleteActionPayload, Observable<TResult>>
{
  public constructor(@Inject(REQUEST_CLIENT) private http: RequestClient) {}

  handle(arg: DeleteActionPayload): Observable<TResult> {
    const { url, id, params } = arg;
    const _url = `${
      url.endsWith('/') ? url.substring(0, url.length - 1) : url
    }/${id}`;
    return from(
      this.http.request(_url, 'DELETE', undefined, params)
    ) as Observable<TResult>;
  }
}

/**
 * Update Action handler class declaration
 */
@Injectable()
export class UpdateQueryActionHandler<TResult>
  implements ActionHandler<UpdateActionPayload, Observable<TResult>>
{
  public constructor(@Inject(REQUEST_CLIENT) private http: RequestClient) {}

  handle(arg: UpdateActionPayload): Observable<TResult> {
    const { url, id, body, params } = arg;
    const _url = `${
      url.endsWith('/') ? url.substring(0, url.length - 1) : url
    }/${id}`;
    return from(
      this.http.request(_url, 'PUT', body, params)
    ) as Observable<TResult>;
  }
}


/**
 * Create Action handler class declaration
 */
@Injectable()
export class CreateQueryActionHandler<TResult>
  implements ActionHandler<CreateActionPayload, Observable<TResult>>
{
  public constructor(@Inject(REQUEST_CLIENT) private http: RequestClient) {}
  handle(arg: CreateActionPayload): Observable<TResult> {
    const { url, body, params } = arg;
    return from(
      this.http.request(url, 'POST', body, params)
    ) as Observable<TResult>;
  }
}
