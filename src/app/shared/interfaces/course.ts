export interface Course {
  id: string;
  comision: number;
  name: string;
  startDate: Date;
  endDate: Date;
  classesCount: number;
  duration: number;
  teacherId: string
};
