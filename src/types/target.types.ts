export interface Target {
  id: number;
  name: string;
  url: string;
  createdAt: string;
  checkInterval: number;
}

export interface CreateTargetRequest {
  name: string;
  url: string;
  checkInterval: number;
}

export interface UpdateTargetRequest {
  name: string;
  url: string;
  checkInterval: number;
}