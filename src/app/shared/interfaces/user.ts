export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT'

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number | string;
  adress: string;
  password: string;
  role: UserRole;
  token: string
};