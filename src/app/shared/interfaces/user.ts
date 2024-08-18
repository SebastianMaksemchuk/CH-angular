export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT'

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  token: string
};