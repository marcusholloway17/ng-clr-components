import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ViewStateComponentType } from '../types';

/**
 * Data components can deactivate guard.
 * It checks if user is in an edit view
 */
export function canDeactivateComponent<
  T extends ViewStateComponentType = ViewStateComponentType
>(matches: string[] = ['/']) {
  return (
    component: T,
    _: ActivatedRouteSnapshot,
    __: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ) => {
    const _dataViewRef = component.dataViewRef;
    if (!_dataViewRef) {
      return true;
    }

    if (matches.indexOf(nextState.url) !== -1) {
      const _formView =
        _dataViewRef.state.view === 'createView' ||
        _dataViewRef.state.view === 'editView';

      //
      // User is in edit view, we switch to list or grid view
      if (_formView) {
        _dataViewRef.setView('listView');
        return false;
      }
    }

    return true;
  };
}
