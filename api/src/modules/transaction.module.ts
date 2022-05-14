import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TransactionResolver,
  TransactionResultResolver,
} from 'src/resolvers/transaction.resolver';
import { TransactionService } from 'src/services/transaction.service';
import { Transaction, TransactionSchema } from 'src/schemas/transaction.schema';
import { UserModule } from './user.module';
import { UserService } from 'src/services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Transaction.name,
        schema: TransactionSchema,
      },
    ]),
    forwardRef(() => UserModule),
  ],
  providers: [
    UserService,
    TransactionService,
    TransactionResolver,
    TransactionResultResolver,
  ],
  exports: [
    MongooseModule.forFeature([
      {
        name: Transaction.name,
        schema: TransactionSchema,
      },
    ]),
  ],
})
export class TransactionModule {}
