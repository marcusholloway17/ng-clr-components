import { Inject, Injectable, Optional } from '@angular/core';
import { Dialog } from './types';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class BrowSerDialog implements Dialog {
  private _defaultView!: Window;

  // class constructor
  constructor(@Inject(DOCUMENT) @Optional() document?: Document) {
    const { defaultView } = document ?? {};
    this._defaultView = defaultView as Window & typeof globalThis;
  }

  // confirm implementation
  confirm(message: string): Promise<boolean> {
    if (
      typeof this._defaultView !== 'undefined' &&
      this._defaultView !== null
    ) {
      return new Promise((resolve) => {
        resolve(this._defaultView.confirm(message));
      });
    }

    return Promise.reject(
      'Browser is expected for the dialog box implementation'
    );
  }
}
