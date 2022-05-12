import { Module } from '@nestjs/common';
import { AuthResolver, AuthResultResolver } from 'src/resolvers/auth.resolver';
import { UserModule } from './user.module';
import { UserService } from 'src/services/user.service';

@Module({
  imports: [UserModule],
  providers: [UserService, AuthResolver, AuthResultResolver],
})
export class AuthModule {}
