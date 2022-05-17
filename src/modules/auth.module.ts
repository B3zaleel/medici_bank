import { Module } from '@nestjs/common';
import { AuthResolver, AuthResultResolver } from '../resolvers/auth.resolver';
import { UserModule } from './user.module';
import { UserService } from '../services/user.service';

@Module({
  imports: [UserModule],
  providers: [UserService, AuthResolver, AuthResultResolver],
})
export class AuthModule {}
