import { Class } from "./class";
import { User } from "./user";

export interface Course {
  id: string;
  comision: number;
  name: string;
  startDate: Date;
  endDate: Date;
  studentQuota: number;
  enrolledStudents: any;
};

export interface CourseV2 {
  id: string;
  comision: number;
  name: string;
  classesIds: string[]
  enrolledStudentsIds: string[];
};