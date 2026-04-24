import { UserApiClient } from '@/api-client';

const API_BASE_URL = '/api';

export const userApi = new UserApiClient(API_BASE_URL);
