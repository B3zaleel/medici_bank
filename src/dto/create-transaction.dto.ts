export class CreateTransactionDto {
  /**
   * The id of the transaction.
   */
  id: string;

  /**
   * The user associated with the transaction.
   */
  userId: string;

  /**
   * Information about the source of the transaction.
   */
  info: string;

  /**
   * The type of transaction.
   */
  type: 'Credit' | 'Debit';

  /**
   * The time the transaction was created.
   */
  createdOn: Date;

  /**
   * The amount of money exchanged in the transaction (in Kobos).
   */
  amount: number;

  /**
   * The amount of money in the user's account as a result of
   * the transaction (in Kobos).
   */
  balance: number;
}
