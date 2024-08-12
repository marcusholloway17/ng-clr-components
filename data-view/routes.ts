import { Route } from '@angular/router';
import { DataViewComponent } from './data-view.component';
import { canDeactivateComponent } from '../data';

export default [
  {
    path: '',
    component: DataViewComponent,
    canDeactivate: [canDeactivateComponent(['/'])],
  },
] as Route[];
