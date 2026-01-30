export interface UserToken {
  id: number;
  token: string;
  device_type: string;
  version: string;
  model: string;
  brand_name: string;
  app_version: string;
  user_id: number;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string | null;
  language: string;
  social_id: string | null;
  login_type: string;
  subscription_type: string | null;
  user_type: string;
  profile_picture: File | string | null;
  email_verified_at: string | null;
  createdAt: string;
  updatedAt: string;
  is_questionnaire: boolean;
  is_priority: boolean;
  recommendation: boolean;
  email_notification: boolean;
  push_notification: boolean;
  subscribe_at: string | null;
  expire_at: string | null;
  subscription_active_status: number;
  is_sandbox: number;
  trial_days: number;
  questionnaire_attempt_at: string | null;
  lastLoginAt: string | null;
  userToken?: UserToken;
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
