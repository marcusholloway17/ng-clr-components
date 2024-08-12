import { Pipe, PipeTransform } from '@angular/core';
import { JSObject } from '@azlabsjs/js-object';

@Pipe({
    name: 'propertyValue'
})
export class DataPropertyValuePipe implements PipeTransform {
  /**
   * Resolve the value for the provided property
   */
  transform(value: object, key: string) {
    return JSObject.getProperty(value, key) ?? '';
  }
}
