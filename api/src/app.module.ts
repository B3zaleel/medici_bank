import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';
import 'dotenv/config';
import { DecodeAuthToken } from './utils/auth_helper';
import { UserModule } from './modules/user.module';
import { AuthModule } from './modules/auth.module';
import { TransactionModule } from './modules/transaction.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.npm_lifecycle_event.startsWith('test')
        ? process.env.MONGO_DB_URI_TEST
        : process.env.MONGO_DB_URI,
    ),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql', './**/*.gql'],
      definitions: {
        path: 'src/types/graphql.ts',
        outputAs: 'class',
      },
      context: ({ req }) => {
        const authTokenParts = (req.headers.authorization || '')
          .trim()
          .split(' ');
        if (authTokenParts.length == 2 && authTokenParts[0] == 'Bearer') {
          const token = DecodeAuthToken(authTokenParts[1]);
          if (!token) {
            return {
              userId: '',
              isExpired: true,
              errorMessage: 'Invalid authentication token',
            };
          }
          const isExpired = token.exp <= Date.now();
          const userId = isExpired ? null : token.userId;
          const errorMessage = isExpired ? 'Token has expired' : '';
          return { userId, isExpired, errorMessage };
        }
        return {
          userId: '',
          isExpired: true,
          errorMessage: 'Missing authentication token',
        };
      },
    }),
    UserModule,
    AuthModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
