import { Transaction, TransactionResult } from '../types/transaction';
import { ActionResult, STATUS_OK } from '../types/action_result';

/**
 * Represents a class for handling transaction-related API calls.
 */
export default class TransactionAPIReq {
  BASE_URL!: string;
  AUTH_TOKEN!: string;

  constructor(baseURL: string, token: string) {
    this.BASE_URL = baseURL;
    this.AUTH_TOKEN = token;
  }

  /**
   * Deposits money into a user's account.
   * @param amount - The amount to be deposited.
   */
  async deposit(amount: number): Promise<TransactionResult> {
    const query = `
    mutation {
      deposit(amount: ${amount}) {
        __typename
        ... on Transaction {
          id
          type
          createdOn
          info
          amount
          balance
        }
        ... on ActionResult {
          success
          message
        }
      }
    }
    `;
    const res = await fetch(this.BASE_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.AUTH_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    });
    let result: TransactionResult = {
      __typename: 'ActionResult',
      success: false,
      message: '',
    };
    if (res.status === STATUS_OK) {
      const body = JSON.parse(await res.text());
      if (body.data) {
        if (body.data.deposit.__typename === 'Transaction') {
          result = {
            __typename: body.data.deposit.__typename,
            id: body.data.deposit.id,
            type: body.data.deposit.type,
            createdOn: new Date(body.data.deposit.createdOn),
            info: body.data.deposit.info,
            amount: body.data.deposit.amount,
            balance: body.data.deposit.balance,
          } as Transaction;
        } else {
          result = {
            __typename: body.data.deposit.__typename,
            success: body.data.deposit.success,
            message: body.data.deposit.message,
          } as ActionResult;
        }
      }
      if (body.errors) {
        result = {
          __typename: 'ActionResult',
          success: false,
          message: body.errors[0].message,
        } as ActionResult;
      }
    }
    return result;
  }

  /**
   * Removes money from a user's account.
   * @param amount - The amount to be removed.
   */
  async withdraw(amount: number): Promise<TransactionResult> {
    const query = `
    mutation {
      withdraw(amount: ${amount}) {
        __typename
        ... on Transaction {
          id
          type
          createdOn
          info
          amount
          balance
        }
        ... on ActionResult {
          success
          message
        }
      }
    }
    `;
    const res = await fetch(this.BASE_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.AUTH_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    });
    let result: TransactionResult = {
      __typename: 'ActionResult',
      success: false,
      message: '',
    };
    if (res.status === STATUS_OK) {
      const body = JSON.parse(await res.text());
      if (body.data) {
        if (body.data.withdraw.__typename === 'Transaction') {
          result = {
            __typename: body.data.withdraw.__typename,
            id: body.data.withdraw.id,
            type: body.data.withdraw.type,
            createdOn: new Date(body.data.withdraw.createdOn),
            info: body.data.withdraw.info,
            amount: body.data.withdraw.amount,
            balance: body.data.withdraw.balance,
          } as Transaction;
        } else {
          result = {
            __typename: body.data.withdraw.__typename,
            success: body.data.withdraw.success,
            message: body.data.withdraw.message,
          } as ActionResult;
        }
      }
      if (body.errors) {
        result = {
          __typename: 'ActionResult',
          success: false,
          message: body.errors[0].message,
        } as ActionResult;
      }
    }
    return result;
  }

  /**
   * Moves money from a user's account to another user's account.
   * @param amount - The amount to be moved.
   * @param account - The receiving user's account.
   */
  async transfer(amount: number, account: string): Promise<TransactionResult> {
    const query = `
    mutation {
      transfer(amount: ${amount}, account: "${account}") {
        __typename
        ... on Transaction {
          id
          type
          createdOn
          info
          amount
          balance
        }
        ... on ActionResult {
          success
          message
        }
      }
    }
    `;
    const res = await fetch(this.BASE_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.AUTH_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    });
    let result: TransactionResult = {
      __typename: 'ActionResult',
      success: false,
      message: '',
    };
    if (res.status === STATUS_OK) {
      const body = JSON.parse(await res.text());
      if (body.data) {
        if (body.data.transfer.__typename === 'Transaction') {
          result = {
            __typename: body.data.transfer.__typename,
            id: body.data.transfer.id,
            type: body.data.transfer.type,
            createdOn: new Date(body.data.transfer.createdOn),
            info: body.data.transfer.info,
            amount: body.data.transfer.amount,
            balance: body.data.transfer.balance,
          } as Transaction;
        } else {
          result = {
            __typename: body.data.transfer.__typename,
            success: body.data.transfer.success,
            message: body.data.transfer.message,
          } as ActionResult;
        }
      }
      if (body.errors) {
        result = {
          __typename: 'ActionResult',
          success: false,
          message: body.errors[0].message,
        } as ActionResult;
      }
    }
    return result;
  }

  /**
   * Retrieves transactions made by a user.
   * @param count - The maximum number of transactions to retrieve.
   * @param before - The id of the transaction from which to select before (in creation time).
   */
  async getTransactions(count = 12, before = ''): Promise<TransactionResult[]> {
    const query = `
    query {
      transactions(count: ${count}, before: "${before}") {
        __typename
        ... on Transaction {
          id
          type
          createdOn
          info
          amount
          balance
        }
        ... on ActionResult {
          success
          message
        }
      }
    }
    `;
    const res = await fetch(this.BASE_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.AUTH_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    });
    const result: TransactionResult[] = [];
    if (res.status === STATUS_OK) {
      const body = JSON.parse(await res.text());
      if (body.data) {
        for (const transactionResult of body.data.transactions) {
          if (transactionResult.__typename === 'Transaction') {
            result.push({
              __typename: transactionResult.__typename,
              id: transactionResult.id,
              type: transactionResult.type,
              createdOn: new Date(transactionResult.createdOn),
              info: transactionResult.info,
              amount: transactionResult.amount,
              balance: transactionResult.balance,
            } as Transaction);
          } else {
            result.push({
              __typename: transactionResult.__typename,
              success: transactionResult.success,
              message: transactionResult.message,
            } as ActionResult);
          }
        }
      }
      if (body.errors) {
        result.push({
          __typename: 'ActionResult',
          success: false,
          message: body.errors[0].message,
        } as ActionResult);
      }
    }
    return result;
  }
}
