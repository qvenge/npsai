import { post } from './request';

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export async function login(credentials: LoginData): Promise<Response> {
  return post('/login', credentials);
}
