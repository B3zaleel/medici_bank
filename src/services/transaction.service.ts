import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Transaction,
  TransactionDocument,
} from '../schemas/transaction.schema';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async addTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const newTransaction = new this.transactionModel(createTransactionDto);
    return newTransaction.save();
  }

  async getTransactions(
    userId: string,
    limit: number,
    before: string,
  ): Promise<Transaction[]> {
    const result = [];
    let i = 0;
    const transactions = await this.transactionModel
      .find({ userId })
      .sort({ createdOn: 'desc' })
      .exec();
    let addTransaction = before.trim().length == 0;

    for (const transaction of transactions) {
      if (i == limit) {
        break;
      }
      if (addTransaction) {
        result.push({
          id: transaction.id,
          type: transaction.type,
          createdOn: transaction.createdOn.toUTCString(),
          info: transaction.info,
          amount: transaction.amount,
          balance: transaction.balance,
        });
        i++;
      }
      if (transaction.id == before) {
        addTransaction = true;
      }
    }
    return result;
  }

  async removeUserTransactions(userId: string): Promise<void> {
    this.transactionModel.deleteMany({ userId }).exec();
  }
}
