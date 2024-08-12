import { RestQueryType, SearchableGridColumnType } from '../datagrid';
import { Observable, ObservableInput } from 'rxjs';
import { FormConfigInterface } from '@azlabsjs/smart-form-core';
import { QueryState } from '@azlabsjs/rx-query';
import { DetailColumnType } from './data-detail';
import { ReactiveFormComponentInterface } from '@azlabsjs/ngx-smart-form';
import { Injector } from '@angular/core';

export type FormConfigType = {
  id: string | number;
  url: string;
  /**
   * ready property provides a configuration based form ready state handler
   * ```
   *  	const _config = {
   *  	    ready: (component, selected) {
   *            // Add async or validation handlers to the component form
   *            if (component) {
   *                component.addAsyncValidator(...)
   *            }
   *        }
   *    };
   * ```
   */
  ready: (
    component: ReactiveFormComponentInterface | null,
    injector: Injector | null,
    selected?: EntityBaseType | null
  ) => unknown | Promise<unknown>;

  /**
   * changes provides a configuration based form changes handler function
   */
  changes: (event: unknown) => unknown;

  /**
   * changes provides a configuration based form changes handler function
   */
  error: (event: unknown) => unknown;
};

/**
 * @internal
 */
export type InjectorFnOr<T> = T | ((injector?: Injector | null) => T);

/**
 * Type constructor that convert a basic type a union of the basic type or an observable of the basic type
 * @internal
 */
export type OrObservable<T> = T | Observable<T>;

/**
 * @internal
 */
export type ViewStateComponentType = {
  dataViewRef: DataComponentType | null;
};

/**
 * @internal
 */
export type NextCallback<T, R> = (source: T) => Observable<R>;

/**
 * @internal
 */
type PipeTransformType = string | ((value: any) => any) | undefined;

/**
 * @internal
 */
export type Intercept<T = unknown, R = unknown> = (
  traveler: T,
  next$: NextCallback<T, R>
) => ReturnType<typeof next$>;

/**
 * Position enumerable type declaration
 * @internal
 */
export type ActionUIPositionType = 'overflow' | 'action-bar';

/**
 * @internal
 */
export type HTTPMethodsType =
  | 'POST'
  | 'post'
  | 'PUT'
  | 'put'
  | 'PATCH'
  | 'patch'
  | 'PUT'
  | 'put'
  | 'DELETE'
  | 'delete';

/**
 * @internal
 *
 * Action configuration type declaration
 */
export type UIActionConfigType = {
  /**
   * UI action name
   */
  name: string;
  /**
   * The position of the action on the UI (overflow|action-bar)
   */
  position: ActionUIPositionType;
  /**
   * UI action metadata configuration
   */
  metadata: {
    title: string | ((item: unknown) => string);
    cssClass?: string;
  };
  /**
   * Case the remove function return true, the action
   * will not be added to the view
   */
  remove?: (value: unknown) => boolean;

  /**
   * Function to disbale the action element based on criteria
   */
  disabled?: boolean | ((value: unknown) => boolean);
};

/**
 * @internal
 *
 * Type declaration for single row action
 */
export type UIActionEventArgType<T = unknown> = {
  payload: T;
  action: UIActionConfigType;
};

/**
 * Action union type to restrict the list of properties that can be defined
 * as property of `actions` attribute of `ConfigType` instances.
 */
export type ActionType = 'delete' | 'create' | 'update' | 'list';

/**
 * Base action configuration type declaration. It defines basic properties to
 * handle data action on user interaction
 */
export type BaseActionConfigType = {
  /**
   * Case the remove function return true, the action
   * will not be added to the view
   */
  remove?: (value: unknown) => boolean;

  /**
   * Function to disbale the action element based on criteria
   */
  disabled?: boolean | ((value: unknown) => boolean);

  /**
   * URL where request are sent to. If not provided, we assume the intercept
   * will handle the /DELETE request on it own
   */
  url?: string;

  /**
   * Intercept function for handling request send from UI components
   */
  intercept?: (
    traveler: any,
    next$: NextCallback<any, any>
  ) => ReturnType<typeof next$>;

  /**
   * // TODO: Review the before name and type definition
   * The before callback must be provided in case a data transformation must be performed before presenting UI to application user
   */
  before?: <T, R>(traveler: T) => R | Observable<R>;
};

/**
 * Type declaration for ui configuration of an action
 */
export type ActionUIConfigType = {
  /**
   * Case the remove function return true, the action
   * will not be added to the view
   */
  remove?: (value: unknown) => boolean;

  /**
   * Function to disbale the action element based on criteria
   */
  disabled?: boolean | ((value: unknown) => boolean);

  /**
   * Action label to be used
   */
  title: string | ((item: unknown) => string);

  /**
   * Position where the action is placed on the UI
   * Possible values are `overflow, action-bar`
   */
  position: ActionUIPositionType;

  /**
   * Css class is a style sheet class applied to the ui element when action item is rendered on the view
   */
  cssClass?: string;
};

/**
 * @internal Action configuration type declaration
 */
export type ActionConfigType = BaseActionConfigType &
  ActionUIConfigType & {
    /**
     * List of inputs to exclude during update
     */
    excludedInputs?: string[];

    /**
     * List of inputs that are not required during update
     */
    notRequiredInput?: string[];
  };

/**
 * Custom action configuration type declaration
 */
export type CustomActionConfigType = ActionConfigType & {
  prepareUrl: <T = unknown, TUrl extends string = string>(
    url: TUrl,
    item: T
  ) => string;
  method: HTTPMethodsType;
};

/**
 * Action handler type provides a more generic approach to handle custom user action
 */
export type ActionHandlerType = {
  handle(...args: any): void | Promise<void>;
} & ActionUIConfigType;

/**
 * Action type type declaration
 */
export type ActionsConfigType<TActions extends string = ActionType> =
  | Partial<Record<TActions, ActionConfigType>> &
      Partial<{ [prop: string]: CustomActionConfigType | ActionHandlerType }>;

/**
 * Partial action config type declaration
 */
export type PartialActionConfigType<TActions extends string = ActionType> =
  | Partial<Record<TActions, Partial<ActionConfigType>>> &
      Partial<{
        [prop: string]: Partial<CustomActionConfigType> | ActionHandlerType;
      }>;

/**
 * Data component configuration type declaration. It allows the data component to
 * be more pluggable and adaptable to business requirements
 */
export type ConfigType<TActionType extends ActionType = ActionType> = {
  url?: string;
  form: Partial<FormConfigType> & {
    noGridLayout?: boolean;
  };
  actions?: ActionsConfigType<TActionType>;
  datagrid: {
    /**
     * Provide datagrid column transform function or pipe
     */
    transformColumnTitle?: PipeTransformType | PipeTransformType[];
    /**
     * Provide handler for click event on datagrid row
     */
    click?: (value: unknown) => void | Promise<void>;
    /**
     * Set the datagrid selection state
     */
    selectable?: boolean;
    /**
     * Provides css class to apply to the datagrid element
     */
    class?: string;

    /**
     * Force the datagrid to be in single selection mode
     */
    singleSelection?: boolean;

    /**
     * Resource url on to which search query as sent
     */
    url?: string;
    /**
     * Css classes applied to datagrid row element
     */
    rowClass?: string | ((element: any) => string);
    /**
     * Custom query parameter appended to pagination requests
     */
    query?: RestQueryType;
    /**
     * Datagrid columns configuration
     */
    columns: InjectorFnOr<OrObservable<SearchableGridColumnType[]>>;
    /**
     * Datagrid detail view configuration
     */
    detail?: InjectorFnOr<
      OrObservable<(DetailColumnType & { editable?: boolean })[]>
    >;
  };
};

/**
 * REST requests payload base type declaration
 */
export type RestActionPayload = {
  url: string;
};

/**
 * REST /POST request payload type declaration
 */
export type CreateActionPayload<TBody = unknown> = {
  body: TBody;
  params?: Record<string, unknown>;
} & RestActionPayload;

/**
 * REST interface /PUT request payload type declaration
 */
export type UpdateActionPayload<TBody = unknown> = {
  body: TBody;
  params?: Record<string, unknown>;
  id: string | number;
} & RestActionPayload;

/**
 * REST interface /DELETE request payload type declaration
 */
export type DeleteActionPayload = {
  params?: Record<string, unknown>;
  id: string | number;
} & RestActionPayload;

/**
 * Generic action handlers type declarations
 */
export type ActionHandler<T, R> = {
  handle(arg: T): R;
};

/**
 * @internal
 */
export type RequestMethod =
  | 'GET'
  | 'DELETE'
  | 'OPTION'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'get'
  | 'delete'
  | 'option'
  | 'head'
  | 'post'
  | 'put'
  | 'patch';

/**
 * @internal
 */
export type RequestOptions = {
  headers?: HeadersInit;
  responseType?: 'arraybuffer' | 'text' | 'blob' | 'json';
};

export interface RequestClient {
  /**
   * Send Request to a server enpoint and returns
   * an observable of response type
   *
   * @param path The path to API resource or full server url
   * @param method
   * @param body
   * @param options
   */
  request<T>(
    path: string,
    method: RequestMethod,
    body: unknown,
    options?: RequestOptions
  ): ObservableInput<T>;
}

/**
 * Entity base type declaration
 */
export type EntityBaseType = { id: string | number };

/**
 * Data UI view state type
 */
export type ViewStateType = 'gridView' | 'listView' | 'createView' | 'editView';

/**
 * Component state type declaration
 */
export type StateType = {
  // performingAction: boolean;
  view: ViewStateType;
  formBluePrint?: FormConfigInterface;
  form?: FormConfigInterface;
  previousView?: 'gridView' | 'listView' | 'createView' | 'editView';
  selected?: EntityBaseType;
  cachedQueries: QueryState[];
  dgState: unknown;
};

// #region Common strings
/**
 * Type declaration for string required as common string for
 * data components
 */
export type CommonStringsType = Partial<
  Record<
    string,
    | {
        name: string;
        title: string;
        description?: string;
      }
    | unknown
  >
> &
  ActionsCommonStringsType;

export type ActionsCommonStringsType = {
  refresh?: string;
  create?: string;
  delete?: string;
  update?: string;
  submit?: string;
  back?: string;
};
// #endregion Common strings

// #region Data component type declarations
/**
 * @internal
 */
type UpdatePayload<T> = {
  event: T;
  config: ConfigType;
  id: string | number;
};

/**
 * @internal
 */
type DeletePayload = {
  id: string | number;
  config: ConfigType;
};

/**
 * @internal
 */
type CreatePayload<T> = {
  event: T;
  config: ConfigType;
};

/**
 * Type declaration of data component update method
 */
export type DataUpdateHandler<T = unknown> = (
  payload: UpdatePayload<T>
) => Promise<unknown>;

/**
 * Type declaration of data component create method
 */
export type DataCreateHandler<T = unknown> = (
  payload: CreatePayload<T>
) => Promise<unknown>;

/**
 * Type declaration of data component delete method
 */
export type DataDeleteHandler = (payload: DeletePayload) => Promise<unknown>;

/**
 * Data component type declaration
 */
export type DataComponentType = {
  /**
   * Form component reference. Should check if value is null or undefined
   * before calling it method as it's a reference variable that might return null pointer
   */
  form: ReactiveFormComponentInterface | null;

  /**
   * Data component state type declaration
   */
  state: StateType;
  /**
   * Set the UI view state
   *
   * @param view
   */
  setView(view: ViewStateType): void;
  /**
   * Handle update action using UI configuration
   */
  update: DataUpdateHandler;
  /**
   * Handle UI create action
   */
  create: DataCreateHandler;

  /*
   * Handles action to remove/delete a resource from the database
   */
  delete: DataDeleteHandler;
};
// #endregion Data component type declarations
