import { Injector } from '@angular/core';
import { Route } from '@angular/router';

/**
 * Navigation link property type declaration
 * @internal
 */
export type HRefType = string | ((injector: Injector) => void | Promise<void>);

/**
 * @internal
 * Top bar links type declarations
 */
export type Link = {
  label: string;
  href: HRefType;
  cssClass?: string;
  links?: Link[];
};

/**
 * @internal
 * Provides type declarations for links that are scoped
 */
export type ScopedLink = {
  label: string;
  href: string;
  scopes: string[];
  cssClass?: string;
  links?: ScopedLink[];
};

/**
 * @internal
 */
export type UILink = {
  cssClass?: string;
  label: string;
  href: HRefType;
};

/**
 * Header link type declaration for link
 */
export type HeaderLink<T = { [prop: string]: unknown }> = {
  label: string;
  href: HRefType;
  scopes: string[];
  cssClass?: string;
  config?: T;
  links?: HeaderLink<T>[];
  routeConfig?: Partial<Route> & {
    implicit?: boolean;
  };
};

/**
 * Type declaration for header links
 */
export type HeaderLinks<T = { [prop: string]: unknown }> = HeaderLink<T>[];
