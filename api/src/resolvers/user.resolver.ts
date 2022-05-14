import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Context,
} from '@nestjs/graphql';
import { argon2i } from 'argon2-ffi';
import { UserService } from 'src/services/user.service';
import { TransactionService } from 'src/services/transaction.service';

@Resolver('Transaction')
export class UserResolver {
  constructor(
    private userService: UserService,
    private transactionService: TransactionService,
  ) {}

  @Query()
  async getUser(
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
    return this.userService.getUserById(userId);
  }

  @Mutation()
  async removeAccount(
    @Args('phone') phone: string,
    @Args('password') password: string,
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
    const user = await this.userService.getUserById(userId);
    const isValid = await argon2i.verify(user.pwdHash, password);
    if (!isValid) {
      return { success: false, message: 'Invalid phone and/or password.' };
    }
    if (user.phone != phone) {
      return { success: false, message: 'Invalid phone and/or password.' };
    }
    this.userService.removeUser(userId);
    this.transactionService.removeUserTransactions(userId);
    return {
      success: true,
      message: 'Account deleted',
    };
  }
}

@Resolver('UserResult')
export class TransactionResultResolver {
  @ResolveField()
  __resolveType(value) {
    if (value.name) {
      return 'User';
    }
    if (value.message) {
      return 'ActionResult';
    }
    return null;
  }
}