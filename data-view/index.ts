import { DataViewComponent } from './data-view.component';

// Export standalone components from dataview library
export const DATA_VIEW_DIRECTIVES = [DataViewComponent];

export {
  configResolver,
  provideConfigResolver,
  provideUrlConfigResolver,
} from './resolvers';

export {
  provideDataViewConfigsForLink,
  provideDataViewConfigs,
} from './providers';
