import axios from 'axios';
import { type LoginRequest, type AuthenticationResponse } from '../types/auth.types';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
});

export const loginApi = (data: LoginRequest) => {
  return apiClient.post<AuthenticationResponse>('/api/auth/login', data);
};
