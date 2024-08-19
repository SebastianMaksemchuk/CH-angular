export interface Enrollment {
  id: string,
  courseId: string;
  studentId: string;
  enrollmentDate: Date;
  enrolledByUserId: string
}