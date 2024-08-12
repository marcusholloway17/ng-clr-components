import { Pipe, PipeTransform } from '@angular/core';
import { Link, UILink } from '../types';

@Pipe({
  standalone: true,
  name: 'uiLinks',
})
export class UILinksPipe implements PipeTransform {
  transform(values: Link[]) {
    if (typeof values === 'undefined' || values === null) {
      return [];
    }
    return values.map((link) => {
          const { label, cssClass, href } = link as {
            label: string;
            href?: string;
            cssClass?: string;
          };
          return {
            label,
            cssClass: cssClass ?? '',
            href: href ?? '#',
          } as UILink;
        });
  }
}
