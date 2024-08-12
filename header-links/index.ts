import { HeaderLinksComponent } from './header-links.component';
import { SublinksPipe, UILinksPipe } from './pipes';

// Export standalone directives of this library
export const HEADER_LINKS_DIRECTIVES = [
    HeaderLinksComponent,
    UILinksPipe,
    SublinksPipe
];

export { provideHeaderLinks } from './providers';
export { Link, ScopedLink, UILink, HeaderLink, HeaderLinks, HRefType } from './types';
export { APP_LINKS } from './tokens';
export { UILinksPipe, SublinksPipe } from './pipes';