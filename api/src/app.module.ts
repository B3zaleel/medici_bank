import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { DecodeAuthToken } from './utils/auth_helper';
import { UserModule } from './modules/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_DB_URI),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql', './**/*.gql'],
      definitions: {
        path: join(process.cwd(), 'src/types/graphql.ts'),
        outputAs: 'class',
      },
      context: ({ req }) => {
        const authTokenParts = (req.headers.authorization || '')
          .trim()
          .split(' ');
        if (authTokenParts.length() == 2 && authTokenParts[0] == 'Bearer') {
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
          return { userId, isExpired, errorMessage: '' };
        }
        return {
          userId: '',
          isExpired: true,
          errorMessage: 'Missing authentication token',
        };
      },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
