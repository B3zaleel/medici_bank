import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as mongoose from 'mongoose';
import { AppModule } from '../../src/app.module';
import { User, UserSchema } from '../../src/schemas/user.schema';
import {
  Transaction,
  TransactionSchema,
} from '../../src/schemas/transaction.schema';

describe('TransactionResolver (e2e)', () => {
  let app: INestApplication;
  const sampleUser = {
    name: 'Naruto Uzumaki',
    phone: '02245524595',
    password: 'password123',
  };
  const otherUser = {
    name: 'Ging Freecs',
    phone: '02325556478',
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
    const TransactionModel = mongoose.model(
      Transaction.name,
      TransactionSchema,
    );
    await UserModel.deleteMany({ phone: sampleUser.phone }).exec();
    await UserModel.deleteMany({ phone: otherUser.phone }).exec();
    await TransactionModel.deleteMany().exec();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  async function getAuthToken(user: {
    name: string;
    phone: string;
    password: string;
  }): Promise<{ token: string; balance: number }> {
    const signInQuery = `
    mutation {
      signIn(phone: "${user.phone}", password: "${user.password}") {
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
      .send({ query: signInQuery })
      .expect('Content-Type', /json/)
      .expect(200);
    const signInBody = JSON.parse(signInRes.text).data;
    expect(signInBody).toBeDefined();
    expect(signInBody['signIn']['__typename']).toEqual('AuthPayload');
    expect(signInBody['signIn']['bearerToken']).toBeDefined();
    expect(signInBody['signIn']['user']['balance']).toBeDefined();
    const balance = signInBody['signIn']['user']['balance'];
    const token = signInBody['signIn']['bearerToken'];
    return { token, balance };
  }

  it('Negative or 0 withdrawal amount fails', async () => {
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
    const amount = -25000;
    const query = `
      mutation {
        withdraw(amount: ${amount}) {
          __typename
          ... on Transaction {
            id
            type
            info
            amount
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
      .expect('Content-Type', /json/)
      .expect(200);
    const body = JSON.parse(res.text).data;
    expect(body).toBeDefined();
    expect(body['withdraw']['__typename']).toEqual('ActionResult');
    expect(body['withdraw']['success']).toEqual(false);
    expect(body['withdraw']['message']).toEqual(
      'Amount must be greater than 0.',
    );
  });

  it('Invalid withdrawal amount fails', async () => {
    const { token, balance } = await getAuthToken(sampleUser);
    const amount = balance + 500;
    const query = `
      mutation {
        withdraw(amount: ${amount}) {
          __typename
          ... on Transaction {
            id
            type
            info
            amount
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
      .expect('Content-Type', /json/)
      .expect(200);
    const body = JSON.parse(res.text).data;
    expect(body).toBeDefined();
    expect(body['withdraw']['__typename']).toEqual('ActionResult');
    expect(body['withdraw']['success']).toEqual(false);
    expect(body['withdraw']['message']).toEqual('Insufficient funds.');
  });

  it('Invalid deposit amount fails', async () => {
    const { token } = await getAuthToken(sampleUser);
    const amount = -500;
    const query = `
      mutation {
        deposit(amount: ${amount}) {
          __typename
          ... on Transaction {
            id
            type
            info
            amount
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
      .expect('Content-Type', /json/)
      .expect(200);
    const body = JSON.parse(res.text).data;
    expect(body).toBeDefined();
    expect(body['deposit']['__typename']).toEqual('ActionResult');
    expect(body['deposit']['success']).toEqual(false);
    expect(body['deposit']['message']).toEqual(
      'Amount must be greater than 0.',
    );
  });

  it('Valid deposit amount succeeds', async () => {
    const { token, balance } = await getAuthToken(sampleUser);
    const amount = 500;
    const query = `
      mutation {
        deposit(amount: ${amount}) {
          __typename
          ... on Transaction {
            id
            type
            createdOn
            info
            amount
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
      .expect('Content-Type', /json/)
      .expect(200);
    const body = JSON.parse(res.text).data;
    expect(body).toBeDefined();
    expect(body['deposit']['__typename']).toEqual('Transaction');
    expect(body['deposit']['type']).toEqual('Credit');
    expect(body['deposit']['amount']).toEqual(amount);
    expect(body['deposit']['balance']).toEqual(balance + amount);
  });

  it('Valid withdrawal amount succeeds', async () => {
    const { token } = await getAuthToken(sampleUser);
    const depositAmount = 500;
    const depositQuery = `
      mutation {
        deposit(amount: ${depositAmount}) {
          __typename
          ... on Transaction {
            id
            type
            createdOn
            info
            amount
            balance
          }
          ... on ActionResult {
            success
            message
          }
        }
      }
    `;

    const depositRes = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: depositQuery })
      .expect('Content-Type', /json/)
      .expect(200);
    const depositBody = JSON.parse(depositRes.text).data;
    expect(depositBody).toBeDefined();
    expect(depositBody['deposit']['__typename']).toEqual('Transaction');
    const balance = depositBody['deposit']['balance'];
    const amount = 30;
    const query = `
      mutation {
        withdraw(amount: ${amount}) {
          __typename
          ... on Transaction {
            id
            type
            createdOn
            info
            amount
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
      .expect('Content-Type', /json/)
      .expect(200);
    const body = JSON.parse(res.text).data;
    expect(body).toBeDefined();
    expect(body['withdraw']['__typename']).toEqual('Transaction');
    expect(body['withdraw']['type']).toEqual('Debit');
    expect(body['withdraw']['amount']).toEqual(amount);
    expect(body['withdraw']['balance']).toEqual(balance - amount);
  });

  it('Retrieving transactions', async () => {
    const TransactionModel = mongoose.model(
      Transaction.name,
      TransactionSchema,
    );
    await TransactionModel.deleteMany().exec();
    const { token, balance } = await getAuthToken(sampleUser);
    const additionAmount = 50;
    const transactionIds = [];
    for (let i = 1; i < 6; i++) {
      const depositAmount = balance + i * additionAmount;
      const depositQuery = `
        mutation {
          deposit(amount: ${depositAmount}) {
            __typename
            ... on Transaction {
              id
              type
              createdOn
              info
              amount
              balance
            }
            ... on ActionResult {
              success
              message
            }
          }
        }
      `;
      const depositRes = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({ query: depositQuery })
        .expect('Content-Type', /json/)
        .expect(200);
      const depositBody = JSON.parse(depositRes.text).data;
      expect(depositBody).toBeDefined();
      expect(depositBody['deposit']['__typename']).toEqual('Transaction');
      transactionIds.push(depositBody['deposit']['id']);
    }
    const query = `
      query {
        transactions(count: ${5}, before: "") {
          __typename
          ... on Transaction {
            id
            type
            createdOn
            info
            amount
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
      .expect('Content-Type', /json/)
      .expect(200);
    const body = JSON.parse(res.text).data;
    expect(body).toBeDefined();
    expect(body['transactions'].length).toEqual(5);
    expect(body['transactions'][0]['__typename']).toEqual('Transaction');
    // sub page with before
    const subPageQuery = `
      query {
        transactions(count: ${5}, before: "${transactionIds[2]}") {
          __typename
          ... on Transaction {
            id
            type
            createdOn
            info
            amount
            balance
          }
          ... on ActionResult {
            success
            message
          }
        }
      }
    `;

    const subPageRes = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: subPageQuery })
      .expect('Content-Type', /json/)
      .expect(200);
    const subPageBody = JSON.parse(subPageRes.text).data;
    expect(subPageBody).toBeDefined();
    expect(subPageBody['transactions'].length).toEqual(2);
    expect(subPageBody['transactions'][0]['__typename']).toEqual('Transaction');
    // sub page with count
    const subPageQuery1 = `
      query {
        transactions(count: ${1}, before: "${transactionIds[2]}") {
          __typename
          ... on Transaction {
            id
            type
            createdOn
            info
            amount
            balance
          }
          ... on ActionResult {
            success
            message
          }
        }
      }
    `;

    const subPageRes1 = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: subPageQuery1 })
      .expect('Content-Type', /json/)
      .expect(200);
    const subPageBody1 = JSON.parse(subPageRes1.text).data;
    expect(subPageBody1).toBeDefined();
    expect(subPageBody1['transactions'].length).toEqual(1);
    expect(subPageBody1['transactions'][0]['__typename']).toEqual('Transaction');
  });

  // TODO: transfer tests
  afterAll(() => {
    app.close();
  });
});
