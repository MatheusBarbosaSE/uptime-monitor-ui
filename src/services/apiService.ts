import axios from 'axios';
import { type LoginRequest, type AuthenticationResponse } from '../types/auth.types';
import { type CreateTargetRequest, type Target } from '../types/target.types';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
});

export const loginApi = (data: LoginRequest) => {
  return apiClient.post<AuthenticationResponse>('/api/auth/login', data);
};

export const getTargetsApi = (token: string) => {
  return apiClient.get<Target[]>('/api/targets', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createTargetApi = (data: CreateTargetRequest, token: string) => {
  return apiClient.post<Target>('/api/targets', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteTargetApi = (targetId: number, token: string) => {
  return apiClient.delete(`/api/targets/${targetId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};