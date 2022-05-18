import { User, UserResult } from '../types/user';
import { ActionResult, STATUS_OK } from '../types/action_result';

/**
 * Represents a class for handling user-related API calls.
 */
export default class UserAPIReq {
  BASE_URL!: string;
  AUTH_TOKEN!: string;

  constructor(baseURL: string, token: string) {
    this.BASE_URL = baseURL;
    this.AUTH_TOKEN = token;
  }

  /**
   * Retrieve a user's information.
   */
  async getUser(): Promise<UserResult> {
    const query = `
    query {
      getUser {
        __typename
        ... on User {
          name
          phone
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

    let result: UserResult = {
      __typename: 'ActionResult',
      success: false,
      message: '',
    };
    if (res.status === STATUS_OK) {
      const body = JSON.parse(await res.text());
      if (body.data) {
        if (body.data.getUser.__typename === 'User') {
          result = {
            __typename: body.data.getUser.__typename,
            name: body.data.getUser.name,
            phone: body.data.getUser.phone,
            balance: body.data.getUser.balance,
          } as User;
        } else {
          result = {
            __typename: body.data.signIn.__typename,
            success: body.data.getUser.success,
            message: body.data.getUser.message,
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
   * Removes a user's account.
   * @param phone - The user's phone/account number.
   * @param password - The user's password.
   */
  async deleteUser(phone: string, password: string): Promise<ActionResult> {
    const query = `
    mutation {
      removeAccount(phone: "${phone}", password: "${password}") {
        __typename
        success
        message
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
    let result: ActionResult = {
      __typename: 'ActionResult',
      success: false,
      message: '',
    };
    if (res.status === STATUS_OK) {
      const body = JSON.parse(await res.text());
      if (body.data) {
        result = {
          __typename: body.data.signIn.__typename,
          success: body.data.removeAccount.success,
          message: body.data.removeAccount.message,
        } as ActionResult;
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
}
