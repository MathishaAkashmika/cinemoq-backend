import { ClsStore } from 'nestjs-cls';

export interface MinimalUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AppClsStore extends ClsStore {
  'x-request-id': string;
  user: MinimalUser;
}

export interface MinimalUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
}
export enum UserType {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
}
