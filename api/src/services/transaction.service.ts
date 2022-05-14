import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Transaction,
  TransactionDocument,
} from 'src/schemas/transaction.schema';
import { CreateTransactionDto } from 'src/dto/create-transaction.dto';

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
    let addTransaction = before.length > 0;

    for (const transaction of transactions) {
      if (i == limit) {
        break;
      }
      if (addTransaction) {
        result.push(transaction);
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
