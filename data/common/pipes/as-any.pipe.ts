import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'asAny',
  pure: true,
})
export class AsAnyPipe implements PipeTransform {
  // Cast the provided value as any
  transform(value: unknown) {
    return value as any;
  }
}
