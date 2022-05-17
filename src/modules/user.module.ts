import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from '../services/user.service';
import { User, UserSchema } from '../schemas/user.schema';
import { UserResolver, UserResultResolver } from '../resolvers/user.resolver';
import { TransactionService } from '../services/transaction.service';
import { TransactionModule } from './transaction.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => TransactionModule),
  ],
  providers: [
    TransactionService,
    UserService,
    UserResolver,
    UserResultResolver,
  ],
  exports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class UserModule {}
