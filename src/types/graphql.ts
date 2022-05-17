
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum TransactionType {
    Credit = "Credit",
    Debit = "Debit"
}

export class AuthPayload {
    bearerToken: string;
    user: User;
}

export class ActionResult {
    success: boolean;
    message: string;
}

export abstract class IMutation {
    abstract signUp(name: string, phone: string, password: string): Nullable<AuthResult> | Promise<Nullable<AuthResult>>;

    abstract signIn(phone: string, password: string): Nullable<AuthResult> | Promise<Nullable<AuthResult>>;

    abstract deposit(amount: number): Nullable<TransactionResult> | Promise<Nullable<TransactionResult>>;

    abstract withdraw(amount: number): Nullable<TransactionResult> | Promise<Nullable<TransactionResult>>;

    abstract transfer(amount: number, account: string): Nullable<TransactionResult> | Promise<Nullable<TransactionResult>>;

    abstract removeAccount(phone: string, password: string): Nullable<ActionResult> | Promise<Nullable<ActionResult>>;
}

export class Transaction {
    id: string;
    type: TransactionType;
    createdOn: string;
    info?: Nullable<string>;
    amount: number;
    balance: number;
}

export abstract class IQuery {
    abstract transactions(count: number, before: string): Nullable<TransactionResult[]> | Promise<Nullable<TransactionResult[]>>;

    abstract getUser(): Nullable<UserResult> | Promise<Nullable<UserResult>>;
}

export class User {
    name: string;
    phone: string;
    balance: number;
}

export type AuthResult = AuthPayload | ActionResult;
export type TransactionResult = Transaction | ActionResult;
export type UserResult = User | ActionResult;
type Nullable<T> = T | null;
