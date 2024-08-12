import { Pipe, PipeTransform } from '@angular/core';
import { HRefType, Link } from '../types';

/**
 * Returns a 1 dimensional array of the list of link items
 */
function flattenLinks(link: Link) {
  let _hrefs: (HRefType | undefined)[] = [];
  const _flatten$ = (_links: Link[]) => {
    for (const _link of _links) {
      _hrefs.push(_link.href);
      if ((_link as { links: Link[] })['links']) {
        _flatten$((_link as { links: Link[] })['links']);
      }
    }
    return _hrefs;
  };
  return _flatten$(link.links ?? []).filter(
    (v) => typeof v !== 'undefined' && v !== null
  ) as string[];
}

@Pipe({
  name: 'sublinks',
  standalone: true,
})
export class SublinksPipe implements PipeTransform {
  transform(values: Link[], href: string): Link[] {
    if (typeof values === 'undefined' || values === null) {
      return [];
    }

    if (typeof href === 'undefined' || href === null) {
      return [];
    }

    let _link = values.find((l) => l.href === href);

    if (_link) {
      return _link.links ?? [];
    }

    // Check if href matches a child route href
    // We convert the tree of links into a 1-dimensional array and search href in the create list
    _link = values.find((l) => l.links && flattenLinks(l).indexOf(href) !== -1);

    // Case the href equals a child link, the current link children are is returned
    if (_link) {
      return _link.links ?? [];
    }

    return [];
  }
}
