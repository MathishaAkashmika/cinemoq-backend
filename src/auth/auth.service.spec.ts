import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bcrypt from 'bcrypt';
import { UserDocument } from 'src/users/entities/user.entity';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user if email and password are valid', async () => {
      const mockUser: any = {
        email: 'test@example.com',
        password: 'hashedPassword',
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await authService.validateUser(
        'test@example.com',
        'password123',
      );
      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      mockUsersService.findOne.mockResolvedValue(null);

      await expect(
        authService.validateUser('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const mockUser: any = {
        email: 'test@example.com',
        password: 'hashedPassword',
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      mockUsersService.findOne.mockResolvedValue(mockUser);

      await expect(
        authService.validateUser('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return a JWT token and user details', async () => {
      const mockUser: UserDocument = {
        _id: 'userId',
        email: 'test@example.com',
        userType: 'CUSTOMER',
        firstName: 'John',
        lastName: 'Doe',
        comparePassword: jest.fn(),
        // Add other necessary Mongoose Document properties and methods
        $assertPopulated: jest.fn(),
        $clearModifiedPaths: jest.fn(),
        $clone: jest.fn(),
        $createModifiedPathsSnapshot: jest.fn(),
        // Add other mock implementations
      } as unknown as UserDocument;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const mockJwtService = {
        signAsync: jest.fn().mockResolvedValue('jwtToken'),
      };

      const result = await authService.login(mockUser);

      expect(result).toEqual({
        user: {
          _id: 'userId',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          userType: 'CUSTOMER',
        },
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 'userId',
        email: 'test@example.com',
        userType: 'CUSTOMER',
      });
    });
  });

  describe('findUserByEmail', () => {
    it('should return a user if found', async () => {
      const mockUser: UserDocument = {
        email: 'test@example.com',
      } as UserDocument;
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await authService.findUserByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      mockUsersService.findOne.mockResolvedValue(null);

      const result = await authService.findUserByEmail(
        'nonexistent@example.com',
      );
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should successfully create a new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
      };
      const mockUser: UserDocument = {
        email: 'newuser@example.com',
      } as UserDocument;

      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await authService.createUser(userData);
      expect(result).toEqual(mockUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(userData);
    });
  });
});
