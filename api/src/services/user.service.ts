import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateUserDto } from 'src/dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async addUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async getUserById(userId: string): Promise<User> {
    return this.userModel.findOne({ id: userId });
  }

  async getUserByPhone(phone: string): Promise<User> {
    return this.userModel.findOne({ phone });
  }

  async removeUser(userId: string): Promise<void> {
    this.userModel.deleteOne({ id: userId });
  }
}
