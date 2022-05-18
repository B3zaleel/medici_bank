import { User } from './user';
import { ActionResult } from '../types/action_result';

export interface AuthPayload {
  __typename: 'AuthPayload';
  bearerToken: string;
  user: User;
}

export type AuthResult = AuthPayload | ActionResult;
