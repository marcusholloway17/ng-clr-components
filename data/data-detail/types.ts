/**
 * @internal
 */
type PipeTransformType = string | ((value: any) => any) | undefined;

/**
 * Detail columns type declaration
 */
export type DetailColumnType = {
  title: string;
  field: string;
  titleTransform?: PipeTransformType | PipeTransformType[];
  transform?: PipeTransformType | PipeTransformType[];
  style?: {
    cssClass?: string | string[];
    styles?: string[] | Record<string, boolean>;
  };
};

/**
 * List of columns type declaration
 */
export type DetailColumnTypes = DetailColumnType[];
