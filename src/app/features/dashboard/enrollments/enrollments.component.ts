import { Component } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import { Enrollment } from '../../../shared/interfaces/enrollment';
import { EnrollmentsService } from '../../../core/services/enrollment.service';
import { Student } from '../../../shared/interfaces/student';
import { Course } from '../../../shared/interfaces/course';
import { CoursesService } from '../../../core/services/courses.service';
import { StudentsService } from '../../../core/services/students.service';
import { MatDialog } from '@angular/material/dialog';
import { EnrollmentDialogComponent } from './components/enrollment-dialog/enrollment-dialog.component';

@Component({
  selector: 'cha-enrollments',
  templateUrl: './enrollments.component.html',
  styleUrl: './enrollments.component.scss'
})

export class EnrollmentsComponent {
  isLoading = true;

  courses: Course[] = [];
  students: Student[] = [];
  enrollments: Enrollment[] = [];
  courses$: Observable<Course[]>;
  students$: Observable<Student[]>;
  enrollments$: Observable<Enrollment[]>;

  displayedColumns: string[] = ['student', 'course', 'delete']
  dataSource: { id: string, student: string, course: string }[] = []

  ngOnInit(): void {
    this.loadEnrollments()
  }

  loadEnrollments() {
    this.isLoading = true;
    forkJoin([this.courses$, this.students$, this.enrollments$]).subscribe({
      next: (results) => {
        this.courses = results[0];
        this.students = results[1];
        this.enrollments = results[2];
        this.updateDataSource();
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  updateDataSource() {
    this.dataSource = this.enrollments.map(enrollment => ({
      id: enrollment.id,
      student: this.getStudent(enrollment.studentId),
      course: this.getCourse(enrollment.courseId),
    }));
  }

  getStudent(studentId: string): string {
    const student = this.students.find(s => s.id === studentId);
    return student ? `(${student.id}) ${student.firstName} ${student.lastName}` : '';
  }

  getCourse(courseId: string): string {
    const course = this.courses.find(c => c.id === courseId);
    return course ? `(${course.comision}) ${course.name}` : '';
  }

  constructor(
    private enrollmentsService: EnrollmentsService,
    private coursesService: CoursesService,
    private studentsService: StudentsService,
    public dialog: MatDialog
  ) {
    this.courses$ = this.coursesService.getCourses();
    this.students$ = this.studentsService.getStudents();
    this.enrollments$ = this.enrollmentsService.getEnrollments()
  }

  openAddEnrollmentDialog(): void {
    this.dialog.open(EnrollmentDialogComponent, {
      data: {
        courses$: this.courses$,
        students$: this.students$
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.enrollmentsService.addEnrollment(result).subscribe({
          next: (updatedEnrollments) => {
            this.enrollments = updatedEnrollments;
            this.updateDataSource();
          }
        });
      }
    });
  }

  deleteEnrollmentById(id: string) {
    if (confirm('¿Está seguro que desea elminiar esta inscripción?')) {
      this.isLoading = true;
      this.enrollmentsService.deleteEnrollment(id).subscribe({
        next: (updatedEnrollments) => {
          this.enrollments = updatedEnrollments;
          this.updateDataSource();
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}