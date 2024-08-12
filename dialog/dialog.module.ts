import { CommonModule } from '@angular/common';
import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { Dialog } from './types';
import { BrowSerDialog } from './browser-dialog.service';
import { DIALOG } from './tokens';

@NgModule({
  imports: [CommonModule],
  providers: [],
})
export class DialogModule {
  /**
   * Register the dialog instance to be used by the application
   *
   * @param factory
   */
  static forRoot(
    factory?: ((injector: Injector) => Dialog) | Dialog
  ): ModuleWithProviders<DialogModule> {
    return {
      ngModule: DialogModule,
      providers: [
        {
          provide: DIALOG,
          useFactory: factory
            ? (injector: Injector) => {
                return typeof factory === 'function' && factory !== null
                  ? factory(injector)
                  : factory;
              }
            : (injector: Injector) => injector.get(BrowSerDialog),
          deps: [Injector],
        },
      ],
    };
  }
}
