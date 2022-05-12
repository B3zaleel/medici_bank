import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from 'src/services/user.service';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService],
  exports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class UserModule {}
