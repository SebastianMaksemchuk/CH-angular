export interface Course {
  id: number;
  comision: number;
  name: string;
  startDate: Date;
  endDate: Date;
  studentQuota: number;
  enrolledStudents: any;
};