export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | undefined

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  password: string;
  token: string
};