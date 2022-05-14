import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

/**
 * Represents a transaction of the Medici bank.
 */
@Schema()
export class Transaction {
  /**
   * The id of the transaction.
   */
  @Prop()
  id: string;

  /**
   * The user associated with the transaction.
   */
  @Prop()
  userId: string;

  /**
   * Information about the source of the transaction.
   */
  @Prop()
  info: string;

  /**
   * The type of transaction.
   */
  @Prop()
  type: 'Credit' | 'Draw';

  /**
   * The time the transaction was created.
   */
  @Prop()
  createdOn: Date;

  /**
   * The amount of money exchanged in the transaction (in Kobos).
   */
  @Prop()
  amount: number;

  /**
   * The amount of money in the user's account as a result of
   * the transaction (in Kobos).
   */
  @Prop()
  balance: number;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
