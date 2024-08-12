import { NgModule } from '@angular/core';
import { ActionSupportedPipe } from './pipes/action-supported.pipe';
import { AsObservablePipe } from './pipes/as-observable.pipe';
import { ActionTitlePipe } from './pipes/action-title.pipe';
import { DataPropertyValuePipe } from './pipes/data-property.pipe';
import { AsAnyPipe } from './pipes/as-any.pipe';

@NgModule({
  imports: [],
  declarations: [
    ActionSupportedPipe,
    AsObservablePipe,
    ActionTitlePipe,
    DataPropertyValuePipe,
    AsAnyPipe,
  ],
  exports: [
    ActionSupportedPipe,
    AsObservablePipe,
    ActionTitlePipe,
    DataPropertyValuePipe,
    AsAnyPipe,
  ],
})
export class DataCommonModule {}
