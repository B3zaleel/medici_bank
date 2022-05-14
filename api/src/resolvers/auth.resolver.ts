import { Resolver, Mutation, Args, ResolveField } from '@nestjs/graphql';
import { argon2i } from 'argon2-ffi';
import { v4 } from 'uuid';
import 'dotenv/config';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { EncodeAuthClaims } from '../utils/auth_helper';

@Resolver('Auth')
export class AuthResolver {
  constructor(private userService: UserService) {}

  @Mutation()
  async signUp(
    @Args('name') name: string,
    @Args('phone') phone: string,
    @Args('password') password: string,
  ) {
    const oldUser = await this.userService.getUserByPhone(phone);
    if (oldUser) {
      return { success: false, message: 'Phone already exists.' };
    }
    const userId = v4();
    const pwdHash = await argon2i.hash(
      password,
      Buffer.from(process.env.ARGON2_SALT),
    );
    const curDateTime = new Date(Date.now());
    const newUser: CreateUserDto = {
      name,
      phone,
      pwdHash,
      id: userId,
      createdOn: curDateTime,
      updatedOn: curDateTime,
      balance: 0,
    };
    await this.userService.addUser(newUser);
    const bearerToken = EncodeAuthClaims(newUser.id);
    const user = {
      name,
      phone,
      balance: 0,
    };
    return { bearerToken, user };
  }

  @Mutation()
  async signIn(
    @Args('phone') phone: string,
    @Args('password') password: string,
  ) {
    const oldUser = await this.userService.getUserByPhone(phone);
    if (!oldUser) {
      return { success: false, message: 'User does not exist.' };
    }
    const isValid = await argon2i.verify(oldUser.pwdHash, password);
    if (!isValid) {
      return { success: false, message: 'Invalid phone and/or password.' };
    }
    const bearerToken = EncodeAuthClaims(oldUser.id);
    const user = {
      name: oldUser.name,
      phone: oldUser.phone,
      balance: oldUser.balance,
    };
    return { bearerToken, user };
  }
}

@Resolver('AuthResult')
export class AuthResultResolver {
  @ResolveField()
  __resolveType(value) {
    if (value.user) {
      return 'AuthPayload';
    }
    return 'ActionResult';
  }
}
