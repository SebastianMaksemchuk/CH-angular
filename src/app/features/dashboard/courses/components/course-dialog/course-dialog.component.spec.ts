import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { CourseDialogComponent } from './course-dialog.component';
import { Course } from '../../../../../shared/interfaces/course';
import { SharedModule } from '../../../../../shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

describe('CourseDialogComponent', () => {
  let component: CourseDialogComponent;
  let fixture: ComponentFixture<CourseDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<CourseDialogComponent>>;
  let mockCourse: Course;

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockCourse = {
      id: 'abcde',
      comision: 101,
      name: 'Angular Basics',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-01'),
      classesCount: 10,
      duration: 100,
      teacherId: 'wxyz',
    };

    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        NoopAnimationsModule
      ],
      declarations: [CourseDialogComponent],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockCourse },
        { provide: DateAdapter, useClass: DateAdapter },
        provideNativeDateAdapter(),
      ]
    }).compileComponents();

    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<CourseDialogComponent>>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required controls', () => {
    expect(component.courseForm.contains('id')).toBeTrue();
    expect(component.courseForm.contains('comision')).toBeTrue();
    expect(component.courseForm.contains('name')).toBeTrue();
    expect(component.courseForm.contains('startDate')).toBeTrue();
    expect(component.courseForm.contains('endDate')).toBeTrue();
    expect(component.courseForm.contains('classesCount')).toBeTrue();
    expect(component.courseForm.contains('duration')).toBeTrue();
    expect(component.courseForm.contains('teacherId')).toBeTrue();
  });

  it('should make name control required', () => {
    const control = component.courseForm.get('name');
    expect(control).toBeTruthy();
    control!.setValue(null);
    expect(control!.valid).toBeFalse();
  });

  it('should make comision control required', () => {
    const control = component.courseForm.get('comision');
    expect(control).toBeTruthy();
    control!.setValue(null);
    expect(control!.valid).toBeFalse();
  });

  it('should make startDate control required', () => {
    const control = component.courseForm.get('startDate');
    expect(control).toBeTruthy();
    control!.setValue(null);
    expect(control!.valid).toBeFalse();
  });

  it('should make endDate control required', () => {
    const control = component.courseForm.get('endDate');
    expect(control).toBeTruthy();
    control!.setValue(null);
    expect(control!.valid).toBeFalse();
  });

  it('should make classesCount control required', () => {
    const control = component.courseForm.get('classesCount');
    expect(control).toBeTruthy();
    control!.setValue(null);
    expect(control!.valid).toBeFalse();
  });

  it('should make duration control required', () => {
    const control = component.courseForm.get('duration');
    expect(control).toBeTruthy();
    control!.setValue(null);
    expect(control!.valid).toBeFalse();
  });

  it('should make teacherId control required', () => {
    const control = component.courseForm.get('teacherId');
    expect(control).toBeTruthy();
    control!.setValue(null);
    expect(control!.valid).toBeFalse();
  });

  it('should close dialog with form value on submit if form is valid', () => {
    component.courseForm.setValue({
      id: 'abcde',
      comision: 101,
      name: 'Angular Basics',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-01'),
      classesCount: 10,
      duration: 100,
      teacherId: 'wxyz',
    });
    component.onSubmit();
    expect(dialogRef.close).toHaveBeenCalledWith({
      id: 'abcde',
      comision: 101,
      name: 'Angular Basics',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-01'),
      classesCount: 10,
      duration: 100,
      teacherId: 'wxyz',
    });
  });

  it('should close dialog without value on cancel', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalledWith();
  });
});
