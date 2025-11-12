export interface UserDetailsResponse {
  id: number;
  username: string;
  email: string;
}

export interface UpdateUserRequest {
  username: string;
  email: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}