import { ObservableInput } from 'rxjs';
import {
  RequestClient as AbstractRequestClient,
  RequestMethod,
  RequestOptions,
} from './types';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class NgHttpRequestClient implements AbstractRequestClient {
  // Class constructor
  constructor(private http: HttpClient) {}

  request<T>(
    path: string,
    method: RequestMethod,
    body: unknown,
    options?: RequestOptions | undefined
  ): ObservableInput<T> {
    return this.http.request(method, path, {
      body,
      observe: 'body',
      responseType: options?.responseType || 'json',
      headers: new HttpHeaders(
        (options?.headers as Record<string, any>) ?? {
          Accept: '*/*',
          'Content-Type': 'application/json',
        }
      ),
    });
  }
}
