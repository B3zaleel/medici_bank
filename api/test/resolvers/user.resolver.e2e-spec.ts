import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as mongoose from 'mongoose';
import { AppModule } from '../../src/app.module';
import { User, UserSchema } from '../../src/schemas/user.schema';

describe('UserResolver (e2e)', () => {
  let app: INestApplication;
  const sampleUser = {
    name: 'Gon Freecs',
    phone: '02222222222',
    password: 'password123',
  };
  const falseUser = {
    name: 'Ging Freecs',
    phone: '05555555555',
    password: 'word123',
  };
  const dbURI = process.env.npm_lifecycle_event.startsWith('test')
    ? process.env.MONGO_DB_URI_TEST
    : process.env.MONGO_DB_URI;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    await mongoose.connect(dbURI);
    const UserModel = mongoose.model(User.name, UserSchema);
    await UserModel.deleteMany().exec();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Unauthorized user fetch fails', async () => {
    const query = `
      query {
        getUser {
          __typename
          ... on User {
            name
            phone
            balance
          }
          ... on ActionResult {
            success
            message
          }
        }
      }
    `;

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer')
      .send({ query })
      .expect(200);
    const body = JSON.parse(res.text).data;
    expect(body).toBeDefined();
    expect(body['getUser']['__typename']).toEqual('ActionResult');
    expect(body['getUser']['success']).toEqual(false);
    expect(body['getUser']['message']).toEqual('Missing authentication token');
  });

  it('Invalid authorization token fails authenticated queries', async () => {
    const query = `
      query {
        getUser {
          __typename
          ... on User {
            name
            phone
            balance
          }
          ... on ActionResult {
            success
            message
          }
        }
      }
    `;

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer token')
      .send({ query })
      .expect(200);
    const body = JSON.parse(res.text).data;
    expect(body).toBeDefined();
    expect(body['getUser']['__typename']).toEqual('ActionResult');
    expect(body['getUser']['success']).toEqual(false);
    expect(body['getUser']['message']).toEqual('Invalid authentication token');
  });

  it('Authorized user fetch succeeds', async () => {
    const signUpQuery = `
    mutation {
      signUp(name: "${sampleUser.name}", phone: "${sampleUser.phone}", password: "${sampleUser.password}") {
        __typename
        ... on AuthPayload {
          bearerToken
          user {
            name
            phone
            balance
          }
        }
        ... on ActionResult {
          success
          message
        }
      }
    }
    `;
    const signUpRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: signUpQuery })
      .expect('Content-Type', /json/)
      .expect(200);
    const signUpBody = JSON.parse(signUpRes.text).data;
    expect(signUpBody).toBeDefined();
    expect(signUpBody['signUp']['__typename']).toEqual('AuthPayload');
    expect(signUpBody['signUp']['bearerToken']).toBeDefined();
    const token = signUpBody['signUp']['bearerToken'];
    const query = `
      query {
        getUser {
          __typename
          ... on User {
            name
            phone
            balance
          }
          ... on ActionResult {
            success
            message
          }
        }
      }
    `;

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query })
      .expect(200);
    const body = JSON.parse(res.text).data;
    expect(body).toBeDefined();
    expect(body['getUser']['__typename']).toEqual('User');
    expect(body['getUser']['name']).toEqual(sampleUser.name);
    expect(body['getUser']['phone']).toEqual(sampleUser.phone);
    expect(body['getUser']['balance']).toEqual(0);
  });

  it('Authorized user account deletion with invalid phone fails', async () => {
    const signUpQuery = `
    mutation {
      signIn(phone: "${sampleUser.phone}", password: "${sampleUser.password}") {
        __typename
        ... on AuthPayload {
          bearerToken
          user {
            name
            phone
            balance
          }
        }
        ... on ActionResult {
          success
          message
        }
      }
    }
    `;
    const signInRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: signUpQuery })
      .expect('Content-Type', /json/)
      .expect(200);
    const signInBody = JSON.parse(signInRes.text).data;
    expect(signInBody).toBeDefined();
    expect(signInBody['signIn']['__typename']).toEqual('AuthPayload');
    expect(signInBody['signIn']['bearerToken']).toBeDefined();
    const token = signInBody['signIn']['bearerToken'];
    const query = `
      mutation {
        removeAccount(phone: "${falseUser.phone}", password: "${sampleUser.password}") {
          success
          message
        }
      }
    `;

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query })
      .expect(200);
    const body = JSON.parse(res.text).data;
    expect(body).toBeDefined();
    expect(body['removeAccount']['success']).toEqual(false);
    expect(body['removeAccount']['message']).toEqual(
      'Invalid phone and/or password.',
    );
  });

  it('Authorized user account deletion with invalid password fails', async () => {
    const signUpQuery = `
    mutation {
      signIn(phone: "${sampleUser.phone}", password: "${sampleUser.password}") {
        __typename
        ... on AuthPayload {
          bearerToken
          user {
            name
            phone
            balance
          }
        }
        ... on ActionResult {
          success
          message
        }
      }
    }
    `;
    const signInRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: signUpQuery })
      .expect('Content-Type', /json/)
      .expect(200);
    const signInBody = JSON.parse(signInRes.text).data;
    expect(signInBody).toBeDefined();
    expect(signInBody['signIn']['__typename']).toEqual('AuthPayload');
    expect(signInBody['signIn']['bearerToken']).toBeDefined();
    const token = signInBody['signIn']['bearerToken'];
    const query = `
      mutation {
        removeAccount(phone: "${sampleUser.phone}", password: "${falseUser.password}") {
          success
          message
        }
      }
    `;

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query })
      .expect(200);
    const body = JSON.parse(res.text).data;
    expect(body).toBeDefined();
    expect(body['removeAccount']['success']).toEqual(false);
    expect(body['removeAccount']['message']).toEqual(
      'Invalid phone and/or password.',
    );
  });

  it('Authorized user account deletion succeeds', async () => {
    const signUpQuery = `
    mutation {
      signIn(phone: "${sampleUser.phone}", password: "${sampleUser.password}") {
        __typename
        ... on AuthPayload {
          bearerToken
          user {
            name
            phone
            balance
          }
        }
        ... on ActionResult {
          success
          message
        }
      }
    }
    `;
    const signInRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: signUpQuery })
      .expect('Content-Type', /json/)
      .expect(200);
    const signInBody = JSON.parse(signInRes.text).data;
    expect(signInBody).toBeDefined();
    expect(signInBody['signIn']['__typename']).toEqual('AuthPayload');
    expect(signInBody['signIn']['bearerToken']).toBeDefined();
    const token = signInBody['signIn']['bearerToken'];
    const query = `
      mutation {
        removeAccount(phone: "${sampleUser.phone}", password: "${sampleUser.password}") {
          success
          message
        }
      }
    `;

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query })
      .expect(200);
    const body = JSON.parse(res.text).data;
    expect(body).toBeDefined();
    expect(body['removeAccount']['success']).toEqual(true);
    expect(body['removeAccount']['message']).toEqual('Account deleted');
  });

  afterAll(() => {
    app.close();
  });
});
