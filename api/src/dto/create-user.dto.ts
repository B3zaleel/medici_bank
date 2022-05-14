/* istanbul ignore file */
export class CreateUserDto {
  /**
   * The unque id of the user.
   */
  id: string;

  /**
   * The name of the user.
   */
  name: string;

  /**
   * The user's phone/account number.
   */
  phone: string;

  /**
   * The user's password hash.
   */
  pwdHash: string;

  /**
   * The time the user's account was created.
   */
  createdOn: Date;

  /**
   * The time the user's account was created.
   */
  updatedOn: Date;

  /**
   * The amount of money in the user's account (in Kobos).
   */
  balance: number;
}
