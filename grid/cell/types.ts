/**
 * Cell mode type declaration
 */
export type CellModeType = 'edit' | 'view';

/**
 * Cell navigation direction
 */
export type NavigationDirectionType = 'backward' | 'forward' | 'top' | 'down';

/**
 * Cell selection change type declaration
 */
export type SelectionChangeType = {
  mode: CellModeType;
  index: number;
  direction: NavigationDirectionType;
};
