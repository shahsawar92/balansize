import { User } from '@/types/user';

export const mockUsers: User[] = Array.from({ length: 50 }, (_, index) => ({
  id: `user-${index + 1}`,
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  plan: ['Basic Plan (149/Year)', 'Pro Plan (299/Year)', 'Enterprise Plan (499/Year)'][Math.floor(Math.random() * 3)] as User['plan'],

})); 