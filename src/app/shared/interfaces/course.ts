export interface Course {
  id: string;
  comision: number;
  name: string;
  startDate: Date;
  endDate: Date;
  studentQuota: number;
  enrolledStudents: any;
};
