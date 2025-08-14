import fetchAPI from './api';
import type { components } from '@/types/api-helpers';

type LoginResponse = {
  token: string;
  expiresIn: number;
};

type UserProfile = components['schemas']['UserProfileDto'];
type RegisterDto = components['schemas']['RegisterDto'];
type LoginDto = components['schemas']['LoginDto'];
type UpdateProfileDto = components['schemas']['UpdateProfileDto'];
type UpdatePasswordDto = components['schemas']['UpdatePasswordDto'];

export const loginUser = async (credentials: LoginDto): Promise<LoginResponse> => {
  const data = await fetchAPI<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  if (!data) throw new Error('Login failed');
  return data;
};

export const refreshToken = async (): Promise<LoginResponse> => {
  const data = await fetchAPI<LoginResponse>('/auth/refresh', {
    method: 'POST'
  });
  
  if (!data) throw new Error('Token refresh failed');
  return data;
};

export const registerUser = async (userData: RegisterDto): Promise<void> => {
  const payload = {
    Email: userData.email,
    UserName: userData.userName,
    Password: userData.password,
    ConfirmPassword: userData.confirmPassword
  };

  await fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const getProfile = async (): Promise<UserProfile> => {
  const data = await fetchAPI<UserProfile>('/user/profile');
  if (!data) throw new Error('Failed to fetch profile');
  return data;
};

export const updateProfile = async (profileData: UpdateProfileDto): Promise<void> => {
  await fetchAPI('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};

export const deleteUser = async (userId: string): Promise<void> => {
  await fetchAPI(`/user/delete/${userId}`, {
    method: 'DELETE',
  });
};

export const changePassword = async (passwordData: UpdatePasswordDto): Promise<void> => {
  await fetchAPI('/user/change-password', {
    method: 'PUT',
    body: JSON.stringify(passwordData),
  });
};