import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as mongoose from 'mongoose';
import { AppModule } from '../../src/app.module';
import { User, UserSchema } from '../../src/schemas/user.schema';

jest.setTimeout(1000 * 20);
describe('AuthResolver (e2e)', () => {
  let app: INestApplication;
  const sampleUser = {
    name: 'Gon Freecs',
    phone: '02222222222',
    password: 'password123',
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
    await UserModel.deleteMany({ phone: sampleUser.phone }).exec();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Signing up', async () => {
    const query = `
    mutation {
      signUp(name: "${sampleUser.name}", phone: "${sampleUser.phone}" password: "${sampleUser.password}") {
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
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect('Content-Type', /json/)
      .expect(200);
    const body = JSON.parse(res.text).data;
    expect(body).toBeDefined();
    expect(body['signUp']['__typename']).toEqual('AuthPayload');
    expect(body['signUp']['bearerToken']).toBeDefined();
    expect(body['signUp']['user']['name']).toEqual(sampleUser.name);
    expect(body['signUp']['user']['phone']).toEqual(sampleUser.phone);
    expect(body['signUp']['user']['balance']).toEqual(0);
  });

  it('Signing in', async () => {
    const query = `
    mutation {
      signIn(phone: "${sampleUser.phone}" password: "${sampleUser.password}") {
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
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect('Content-Type', /json/)
      .expect(200);
    const body = JSON.parse(res.text).data;
    expect(body).toBeDefined();
    expect(body['signIn']['__typename']).toEqual('AuthPayload');
    expect(body['signIn']['bearerToken']).toBeDefined();
    expect(body['signIn']['user']['name']).toEqual(sampleUser.name);
    expect(body['signIn']['user']['phone']).toEqual(sampleUser.phone);
    expect(body['signIn']['user']['balance']).toEqual(0);
  });

  it('Signing in with unregistered phone', async () => {
    const query = `
    mutation {
      signIn(phone: "05555555555" password: "${sampleUser.password}") {
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
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect('Content-Type', /json/)
      .expect(200);
    const body = JSON.parse(res.text).data;
    expect(body).toBeDefined();
    expect(body['signIn']['__typename']).toEqual('ActionResult');
    expect(body['signIn']['success']).toEqual(false);
    expect(body['signIn']['message']).toEqual('User does not exist.');
  });

  it('Signing in with invalid password', async () => {
    const query = `
    mutation {
      signIn(phone: "${sampleUser.phone}" password: "footar") {
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
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect('Content-Type', /json/)
      .expect(200);
    const body = JSON.parse(res.text).data;
    expect(body).toBeDefined();
    expect(body['signIn']['__typename']).toEqual('ActionResult');
    expect(body['signIn']['success']).toEqual(false);
    expect(body['signIn']['message']).toEqual('Invalid phone and/or password.');
  });

  it('Signing up with a registered phone', async () => {
    const query = `
    mutation {
      signUp(name: "${sampleUser.name}", phone: "${sampleUser.phone}" password: "${sampleUser.password}") {
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
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect('Content-Type', /json/)
      .expect(200);
    const body = JSON.parse(res.text).data;
    expect(body).toBeDefined();
    expect(body['signUp']['__typename']).toEqual('ActionResult');
    expect(body['signUp']['success']).toEqual(false);
    expect(body['signUp']['message']).toEqual('Phone already exists.');
  });

  afterAll(() => {
    app.close();
  });
});
