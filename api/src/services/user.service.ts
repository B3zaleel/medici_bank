import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async addUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    this.userModel.updateOne({ id: userId }, updateUserDto).exec();
  }

  async getUserById(userId: string): Promise<User> {
    return this.userModel.findOne({ id: userId }).exec();
  }

  async getUserByPhone(phone: string): Promise<User> {
    return this.userModel.findOne({ phone }).exec();
  }

  async removeUser(userId: string): Promise<void> {
    this.userModel.deleteOne({ id: userId }).exec();
  }
}
