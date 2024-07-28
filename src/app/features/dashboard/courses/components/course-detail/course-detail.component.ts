import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { Course } from '../../../../../shared/interfaces/course';
import { CoursesService } from '../../../../../core/services/courses.service';
import { ActivatedRoute } from '@angular/router';
import { StudentsService } from '../../../../../core/services/students.service';
import { EnrollmentsService } from '../../../../../core/services/enrollment.service';
import { Student } from '../../../../../shared/interfaces/student';
import { Enrollment } from '../../../../../shared/interfaces/enrollment';

@Component({
  selector: 'cha-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})

export class CourseDetailComponent implements OnInit {

  course: Course | undefined;
  students: Student[] = [];
  enrollments: Enrollment[] = [];
  filteredEnrollments: Enrollment[] = [];
  students$: Observable<Student[]>;
  enrollments$: Observable<Enrollment[]>;

  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService,
    private studentsService: StudentsService,
    private enrollmentsService: EnrollmentsService
  ) {
    this.students$ = this.studentsService.getStudents();
    this.enrollments$ = this.enrollmentsService.getEnrollments()
  }

  ngOnInit(): void {
    this.loadCourseDetails()
  }

  loadCourseDetails() {
    this.isLoading = true;
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.coursesService.getCourseById(courseId).subscribe({
      next: (course) => {
        this.course = course;
      },
      complete: () => {
        forkJoin([this.students$, this.enrollments$]).subscribe({
          next: (results) => {
            this.students = results[0];
            this.enrollments = results[1];
            this.updateCourse();
          },
          complete: () => {
            this.isLoading = false;
          }
        })
      }
    });
  }

  updateCourse() {
    if (this.course) {
      this.filteredEnrollments = this.enrollments.filter(enrollment => enrollment.courseId === this.course?.id);
      const enrolledStudents = this.filteredEnrollments.map(enrollment => {
        return this.students.find(student => student.id === enrollment.studentId);
      }).filter(student => student !== undefined) as Student[];
      this.course.enrolledStudents = enrolledStudents;
    }
  }

  getStudentName(studentId: number | string): string {
    const student = this.students.find(s => s.id === studentId);
    return student ? `${student.id} - ${student.firstName} ${student.lastName}` : 'Unknown';
  }

  deleteEnrollment(enrollmentId: number) {
    if (confirm('¿Desea elminiar esta inscripción?')) {
      this.isLoading = true;
    this.enrollmentsService.deleteEnrollment(enrollmentId).subscribe({
      next: (updatedEnrollments) => {
        this.enrollments = updatedEnrollments;
        this.updateCourse();
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  }
}