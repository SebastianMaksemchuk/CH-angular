import { Component, OnInit } from '@angular/core';
import { Student } from '../../../../../shared/interfaces/student';
import { ActivatedRoute } from '@angular/router';
import { StudentsService } from '../../../../../core/services/students.service';
import { Course } from '../../../../../shared/interfaces/course';
import { Enrollment } from '../../../../../shared/interfaces/enrollment';
import { forkJoin, Observable } from 'rxjs';
import { EnrollmentsService } from '../../../../../core/services/enrollment.service';
import { CoursesService } from '../../../../../core/services/courses.service';

@Component({
  selector: 'cha-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.scss'
})

export class StudentDetailComponent implements OnInit {

  student: Student | undefined;

  courses: Course[] = [];
  enrollments: Enrollment[] = [];
  filteredEnrollments: Enrollment[] = [];
  courses$: Observable<Course[]>;
  enrollments$: Observable<Enrollment[]>;

  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private studentsService: StudentsService,
    private coursesService: CoursesService,
    private enrollmentsService: EnrollmentsService
  ) {
    this.courses$ = this.coursesService.getCourses();
    this.enrollments$ = this.enrollmentsService.getEnrollments()

  }

  ngOnInit(): void {
    this.loadStudentDetails()
  }

  loadStudentDetails() {
    this.isLoading = true;
    const studentId = Number(this.route.snapshot.paramMap.get('id'));
    this.studentsService.getStudentById(studentId).subscribe({
      next: (student) => {
        this.student = student;
      },
      complete: () => {
        forkJoin([this.courses$, this.enrollments$]).subscribe({
          next: (results) => {
            this.courses = results[0];
            this.enrollments = results[1];
            this.updateStudent();
          },
          complete: () => {
            this.isLoading = false;
          }
        })
      }
    });
  }

  updateStudent() {
    if (this.student) {
      this.filteredEnrollments = this.enrollments.filter(enrollment => enrollment.studentId === this.student?.id);
      const enrolledCourses = this.filteredEnrollments.map(enrollment => {
        return this.courses.find(course => course.id === enrollment.courseId);
      }).filter(course => course !== undefined) as Course[];
      this.student.enrolledCourses = enrolledCourses;
    }
  }

  getCourse(courseId: number | string): string {
    const course = this.courses.find(c => c.id === courseId);
    return course ? `${course.comision} - ${course.name}` : 'Unknown';
  }

  deleteEnrollment(enrollmentId: number) {
    if (confirm('¿Desea elminiar esta inscripción?')) {
      this.isLoading = true;
      this.enrollmentsService.deleteEnrollment(enrollmentId).subscribe({
        next: (updatedEnrollments) => {
          this.enrollments = updatedEnrollments;
          this.updateStudent();
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}