import { ActionResult } from '../types/action_result';

export interface User {
  __typename: 'User';
  name: string;
  phone: string;
  balance: number;
}

export type UserResult = User | ActionResult;
