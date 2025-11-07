export interface HealthCheck {
  id: number;
  checkedAt: string;
  statusCode: number | null;
  statusMessage: string;
}

export interface ApiResponsePage<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}