import { InjectionToken } from '@angular/core';
import {
  ActionHandler,
  CreateActionPayload,
  DeleteActionPayload,
  RequestClient,
  UpdateActionPayload,
} from './types';

/**
 * Request client provider token
 */
export const REQUEST_CLIENT = new InjectionToken<RequestClient>(
  'Data Request Client Provider'
);

/**
 * Delete action handler provider token
 */
export const DELETE_ACTION_HANDLER = new InjectionToken<
  ActionHandler<DeleteActionPayload, unknown>
>('/DELETE Action handler provider');

/**
 * Create action handler provider token
 */
export const CREATE_ACTION_HANDLER = new InjectionToken<
  ActionHandler<CreateActionPayload, unknown>
>('/CREATE Action handler provider');

/**
 * Update action handler provider token
 */
export const UPDATE_ACTION_HANDLER = new InjectionToken<
  ActionHandler<UpdateActionPayload, unknown>
>('/DELETE Action handler provider');
