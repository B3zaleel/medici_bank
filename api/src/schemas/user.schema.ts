import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

/**
 * Represents a user of the Medici bank.
 */
@Schema()
export class User {
  /**
   * The unque id of the user.
   */
  @Prop()
  id: string;

  /**
   * The name of the user.
   */
  @Prop()
  name: string;

  /**
   * The user's phone/account number.
   */
  @Prop()
  phone: string;

  /**
   * The user's password hash.
   */
  @Prop()
  pwdHash: string;

  /**
   * The time the user's account was created.
   */
  @Prop()
  createdOn: Date;

  /**
   * The time the user's account was created.
   */
  @Prop()
  updatedOn: Date;

  /**
   * The amount of money in the user's account (in Kobos).
   */
  @Prop()
  balance: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
