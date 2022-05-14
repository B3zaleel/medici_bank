/* istanbul ignore file */
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from 'src/services/user.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserResolver, UserResultResolver } from 'src/resolvers/user.resolver';
import { TransactionService } from 'src/services/transaction.service';
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
