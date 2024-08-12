import { Provider } from "@angular/core";
import { CREATE_ACTION_HANDLER, DELETE_ACTION_HANDLER, UPDATE_ACTION_HANDLER } from "./tokens";
import { CreateQueryActionHandler, DeleteQueryActionHandler, UpdateQueryActionHandler } from "./handlers";


/**
 * Provider a handler object for update actions
 * 
 * **Note** The default implementation is based on
 * a rest or http client for sending request ot backend
 * server
 */
export function provideCreateActionHandler() {
    return {
        provide: CREATE_ACTION_HANDLER,
        useClass: CreateQueryActionHandler
    } as Provider;
}

/**
 * Provider a handler object for update actions
 * 
 * **Note** The default implementation is based on
 * a rest or http client for sending request ot backend
 * server
 */
export function providerUpdateActionHandler() {
    return {
        provide: UPDATE_ACTION_HANDLER,
        useClass: UpdateQueryActionHandler
    } as Provider;
}

/**
 * Provider a handler object for delete actions
 * 
 * **Note** The default implementation is based on
 * a rest or http client for sending request ot backend
 * server
 */
export function provideDeleteActionHandler() {
    return {
        provide: DELETE_ACTION_HANDLER,
        useClass: DeleteQueryActionHandler
    } as Provider;
}