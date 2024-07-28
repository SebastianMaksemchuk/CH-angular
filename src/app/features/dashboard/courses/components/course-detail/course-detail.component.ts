import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../../../../../shared/interfaces/course';
import { CoursesService } from '../../../../../core/services/courses.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cha-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent implements OnInit {

  course: Course | undefined;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {}

  ngOnInit(): void {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.coursesService.getCourseById(courseId).subscribe({
      next: (course) => {
        this.course = course;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert("Error inesperado")
      }
    });
  }
}