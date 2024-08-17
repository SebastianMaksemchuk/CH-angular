export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  DOB: Date;
  email: string;
  enrolledCourses: any
};

export interface StudentV2 {
  id: string;
  firstName: string;
  lastName: string;
  enrolledCourses: string[]
};