import dotenv from 'dotenv';
import request from 'supertest';
import app from '../src/app';
import { connectDB, disconnectDB } from './testdb';

dotenv.config();

describe('AUTHENTICATION TESTS', () => {
  const userData = {
    first_name: 'Scott',
    last_name: 'Jones',
    email: 'testuser@mail.com',
    password: 'password123',
  };
  
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    // await User.deleteMany({});
    await disconnectDB();
  }); 

  describe('POST /api/auth/register', () => {
    it('should return 422 if invalid/missing input', async () => {
      const response = await request(app).post('/api/auth/register').send({
        first_name: 'Scott',
        last_name: 'Jones',
        email: 'testuser@mail.com',
      });
      expect(response.status).toBe(422);
      expect(response.body.success).toEqual(false);
    });

    it('should register a new user with a 201 status code', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);
      expect(response.status).toBe(201);
      expect(response.body.success).toEqual(true);
      expect(response.body.message).toEqual('User created successfully');
      expect(response.body.data.user).toHaveProperty('_id');
      expect(response.body.data.user).toHaveProperty('email', userData.email);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should return 409 if user email already exists', async () => {
      const response = await request(app).post('/api/auth/register').send({
        first_name: 'Anonymous',
        last_name: 'User',
        email: userData.email,
        password: 'password123',
      });

      expect(response.status).toBe(409);
      expect(response.body.success).toEqual(false);
      expect(response.body.message).toEqual('User already exists');
    });

    it('should return 422 if password is less than 6 characters', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...userData,
          password: 'short',
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toEqual(false);
      expect(response.body.message).toContain(
        'password length must be at least 6 characters long'
      );
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 422 if missing password', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'testuser@mail.com',
      });

      expect(response.status).toBe(422);
      expect(response.body.success).toEqual(false);
      expect(response.body.message).toBe('password is required');
    });

    it('should login a new user with a 200 status code', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: userData.email,
        password: userData.password,
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toEqual(true);
      expect(response.body.message).toEqual('Log in successful');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data.user).toHaveProperty('_id');
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should return a 401 error if email is incorrect', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'testeduser@mail.com',
        password: 'password123',
      });
      expect(response.status).toBe(401);
      expect(response.body.success).toEqual(false);
      expect(response.body.message).toEqual('Invalid login credentials');
    });

    it('should return a 401 error if password is incorrect', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'testuser@mail.com',
        password: 'password',
      });
      expect(response.status).toBe(401);
      expect(response.body.success).toEqual(false);
      expect(response.body.message).toEqual('Invalid login credentials');
    });
  });
});
