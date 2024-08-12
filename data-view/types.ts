import { Injector } from '@angular/core';
import { DataConfigArgType } from '../data';

/**
 * @internal
 *
 * Type declaration for pages configuration
 */
export type ViewConfig = {
  href: string;
  config: DataConfigArgType;
};

/**
 * @internal
 */
export type LinkConfigPair = {
  href: any;
  config?: DataConfigArgType;
  links?: LinkConfigPair[];
};
