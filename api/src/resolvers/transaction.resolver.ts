import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Context,
} from '@nestjs/graphql';
import { v4 } from 'uuid';
import { UserService } from '../services/user.service';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

const MIN_AMOUNT = 0;

@Resolver('Transaction')
export class TransactionResolver {
  constructor(
    private userService: UserService,
    private transactionService: TransactionService,
  ) {}

  @Query()
  async transactions(
    @Args('count') count: number,
    @Args('before') before: string,
    @Context('userId') userId: string,
    @Context('isExpired') isExpired: boolean,
    @Context('errorMessage') errorMessage: string,
  ) {
    if (isExpired) {
      return [
        {
          success: false,
          message: errorMessage,
        },
      ];
    }
    return this.transactionService.getTransactions(userId, count, before);
  }

  @Mutation()
  async deposit(
    @Args('amount') amount: number,
    @Context('userId') userId: string,
    @Context('isExpired') isExpired: boolean,
    @Context('errorMessage') errorMessage: string,
  ) {
    if (isExpired) {
      return {
        success: false,
        message: errorMessage,
      };
    }
    if (amount <= MIN_AMOUNT) {
      return {
        success: false,
        message: `Amount must be greater than ${MIN_AMOUNT}.`,
      };
    }
    const user = await this.userService.getUserById(userId);
    const transaction: CreateTransactionDto = {
      id: v4(),
      userId: userId,
      info: '',
      type: 'Credit',
      createdOn: new Date(Date.now()),
      amount: amount,
      balance: user.balance + amount,
    };
    this.userService.updateUser(userId, { balance: transaction.balance });
    return this.transactionService.addTransaction(transaction);
  }

  @Mutation()
  async withdraw(
    @Args('amount') amount: number,
    @Context('userId') userId: string,
    @Context('isExpired') isExpired: boolean,
    @Context('errorMessage') errorMessage: string,
  ) {
    if (isExpired) {
      return {
        success: false,
        message: errorMessage,
      };
    }
    if (amount <= MIN_AMOUNT) {
      return {
        success: false,
        message: `Amount must be greater than ${MIN_AMOUNT}.`,
      };
    }
    const user = await this.userService.getUserById(userId);
    if (user.balance - amount < 0) {
      return {
        success: false,
        message: 'Insufficient funds.',
      };
    }
    const transaction: CreateTransactionDto = {
      id: v4(),
      userId: userId,
      info: ``,
      type: 'Debit',
      createdOn: new Date(Date.now()),
      amount: amount,
      balance: user.balance - amount,
    };
    this.userService.updateUser(userId, { balance: transaction.balance });
    return this.transactionService.addTransaction(transaction);
  }

  @Mutation()
  async transfer(
    @Args('amount') amount: number,
    @Args('account') account: string,
    @Context('userId') userId: string,
    @Context('isExpired') isExpired: boolean,
    @Context('errorMessage') errorMessage: string,
  ) {
    if (isExpired) {
      return {
        success: false,
        message: errorMessage,
      };
    }
    if (amount <= MIN_AMOUNT) {
      return {
        success: false,
        message: `Amount must be greater than ${MIN_AMOUNT}.`,
      };
    }
    const sender = await this.userService.getUserById(userId);
    if (sender.balance - amount < 0) {
      return {
        success: false,
        message: 'Insufficient funds.',
      };
    }
    const receiver = await this.userService.getUserByPhone(account);
    if (!receiver) {
      return {
        success: false,
        message: 'Receiving account not found.',
      };
    }
    const transactionId = v4();
    const creationDate = new Date(Date.now());
    const senderTransaction: CreateTransactionDto = {
      id: transactionId,
      userId: sender.id,
      info: `Transfer to ${receiver.name}`,
      type: 'Draw',
      createdOn: creationDate,
      amount: amount,
      balance: sender.balance - amount,
    };
    const receiverTransaction: CreateTransactionDto = {
      id: transactionId,
      userId: receiver.id,
      info: `Transfer from ${sender.name}`,
      type: 'Credit',
      createdOn: creationDate,
      amount: amount,
      balance: receiver.balance + amount,
    };
    const senderUpdateDto: UpdateUserDto = {
      balance: senderTransaction.balance,
    };
    const receiverUpdateDto: UpdateUserDto = {
      balance: receiverTransaction.balance,
    };
    this.userService.updateUser(sender.id, senderUpdateDto);
    this.userService.updateUser(receiver.id, receiverUpdateDto);
    this.transactionService.addTransaction(receiverTransaction);
    return this.transactionService.addTransaction(senderTransaction);
  }
}

@Resolver('TransactionResult')
export class TransactionResultResolver {
  @ResolveField()
  __resolveType(value) {
    if (value.amount) {
      return 'Transaction';
    }
    return 'ActionResult';
  }
}
