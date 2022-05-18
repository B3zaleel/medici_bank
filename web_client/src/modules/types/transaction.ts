import { ActionResult } from '../types/action_result';

export type TransactionType = 'Credit' | 'Debit';

export interface Transaction {
  __typename: 'Transaction';
  id: string;
  type: TransactionType;
  createdOn: Date;
  info: string;
  amount: number;
  balance: number;
}

export type TransactionResult = Transaction | ActionResult;
