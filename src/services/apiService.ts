import axios from 'axios';
import { type LoginRequest, type AuthenticationResponse } from '../types/auth.types';
import { type CreateTargetRequest, type Target } from '../types/target.types';
import { type HealthCheck, type ApiResponsePage } from '../types/history.types';

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

export const getHistoryApi = (targetId: number, token: string, page: number = 0) => {
  return apiClient.get<ApiResponsePage<HealthCheck>>(
    `/api/targets/${targetId}/health-checks`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: page,
        size: 10,
        sort: 'checkedAt,desc',
      },
    }
  );
};