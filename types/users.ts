export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  language: string;
  social_id: string | null;
  login_type: string;
  subscription_type: string;
  user_type: string;
  profile_picture: File | string | null;
  email_verified_at: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  success: boolean;
  message: string;
  result: User[];
}

export interface singleUserResponse {
  success: boolean;
  message: string;
  result: User;
}

export interface UserRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  language?: string;
  login_type?: string;
  user_type?: string;
  profile_picture?: File | null;
}
