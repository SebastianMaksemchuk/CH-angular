import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Enrollment } from '../../../shared/interfaces/enrollment';
import { EnrollmentsService } from '../../../core/services/enrollment.service';

@Component({
  selector: 'cha-enrollments',
  templateUrl: './enrollments.component.html',
  styleUrl: './enrollments.component.scss'
})

export class EnrollmentsComponent {
  isLoading = true;
  // enrollments$: Observable<Enrollment[]>;
  enrollments: Enrollment[] = [];

  mySubject$ = new Subject();
  myObservable$ = new Observable((subscriber) => subscriber.next(1));

  constructor(
    private enrollmentsService: EnrollmentsService
  ) {
    this.mySubject$.next(1);

    this.enrollmentsService.getEnrollments().subscribe({
      next: (v) => (this.enrollments = v),
      complete: () => (this.isLoading = false),
    });

    // this.enrollments$ = this.enrollmentsService.getEnrollments().pipe(
    //   finalize(() => {
    //     // Cuando el observable ya se completo
    //     this.isLoading = false;
    //   })
    // );
  }

  addEnrollment(): void {
    this.enrollmentsService.addEnrollment().subscribe({
      next: (v) => (this.enrollments = v),
    });

    // this.notifierService.sendNotification('Se agrego una inscripcion!');
  }
}