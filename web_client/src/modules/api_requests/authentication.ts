import { AuthPayload, AuthResult } from '../types/auth';
import { ActionResult, STATUS_OK } from '../types/action_result';

/**
 * Represents a class for handling authentication-related API calls.
 */
export default class AuthenticationAPIReq {
  BASE_URL!: string;

  constructor(baseURL: string) {
    this.BASE_URL = baseURL;
  }

  /**
   * Authenticate an existing user.
   * @param phone - The user's phone.
   * @param password - The user's password.
   */
  async signIn(phone: string, password: string): Promise<AuthResult> {
    const query = `
    mutation {
      signIn(phone: "${phone}", password: "${password}") {
        __typename
        ... on AuthPayload {
          bearerToken
          user {
            name
            phone
            balance
          }
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
      },
      body: JSON.stringify({ query }),
    });

    let result: AuthResult = {
      __typename: 'ActionResult',
      success: false,
      message: '',
    };
    if (res.status === STATUS_OK) {
      const body = JSON.parse(await res.text());
      if (body.data) {
        if (body.data.signIn.__typename === 'AuthPayload') {
          result = {
            __typename: body.data.signIn.__typename,
            bearerToken: body.data.signIn.bearerToken,
            user: {
              name: body.data.signIn.user.name,
              phone: body.data.signIn.user.phone,
              balance: body.data.signIn.user.balance,
            },
          } as AuthPayload;
        } else {
          result = {
            __typename: body.data.signIn.__typename,
            success: body.data.signIn.success,
            message: body.data.signIn.message,
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
   * Create a new user.
   * @param name - The user's name.
   * @param phone - The user's phone/account number.
   * @param password - The user's password.
   */
  async signUp(
    name: string,
    phone: string,
    password: string,
  ): Promise<AuthResult> {
    const query = `
    mutation {
      signUp(name: "${name}", phone: "${phone}", password: "${password}") {
        __typename
        ... on AuthPayload {
          bearerToken
          user {
            name
            phone
            balance
          }
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
      },
      body: JSON.stringify({ query }),
    });

    let result: AuthResult = {
      __typename: 'ActionResult',
      success: false,
      message: '',
    };
    if (res.status === STATUS_OK) {
      const body = JSON.parse(await res.text());
      if (body.data) {
        if (body.data.signUp.__typename === 'AuthPayload') {
          result = {
            __typename: body.data.signUp.__typename,
            bearerToken: body.data.signUp.bearerToken,
            user: {
              name: body.data.signUp.user.name,
              phone: body.data.signUp.user.phone,
              balance: body.data.signUp.user.balance,
            },
          } as AuthPayload;
        } else {
          result = {
            __typename: body.data.signUp.__typename,
            success: body.data.signUp.success,
            message: body.data.signUp.message,
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
}
