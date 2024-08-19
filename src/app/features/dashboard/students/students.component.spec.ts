import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { StudentsComponent } from './students.component';
import { StudentDialogComponent } from './components/student-dialog/student-dialog.component';
import { StudentsActions } from './store/students.actions';
import { RootState } from '../../../core/store/store';
import { Student } from '../../../shared/interfaces/student';
import { User } from '../../../shared/interfaces/user';
import { SharedModule } from '../../../shared/shared.module';

describe('StudentsComponent', () => {
  let component: StudentsComponent;
  let fixture: ComponentFixture<StudentsComponent>;
  let store: MockStore<RootState>;
  let matDialog: jasmine.SpyObj<MatDialog>;
  let mockStudent: Student;
  let mockUser: User;

  const initialState = {
    students: [],
    studentsError: null,
    studentsIsLoading: false,
    authUser: null
  };

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [StudentsComponent],
      providers: [
        provideMockStore({ initialState }),
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    matDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    mockStudent = {
      id: 'efgh',
      firstName: 'Jane',
      lastName: 'Doe',
      DOB: new Date(),
      email: 'jane.doe@example.com'
    };

    mockUser = {
      id: 'abcd',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '',
      adress: '',
      password: 'password123',
      role: 'ADMIN',
      token: 'abcde12345'
    };
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadStudents action on ngOnInit', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(StudentsActions.loadStudents());
  });

  it('should dispatch unsetStudentsStore action on ngOnDestroy', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(StudentsActions.unsetStudentsStore());
  });

  it('should open student dialog and dispatch createStudent if no student is provided', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    matDialog.open.and.returnValue(dialogRefSpy);

    dialogRefSpy.afterClosed.and.returnValue(of(mockStudent));
    const dispatchSpy = spyOn(store, 'dispatch');

    component.openStudentDialog();
    expect(matDialog.open).toHaveBeenCalledWith(StudentDialogComponent, { data: undefined });
    expect(dispatchSpy).toHaveBeenCalledWith(StudentsActions.createStudent({ payload: mockStudent }));
  });

  it('should open student dialog and dispatch editStudent if student is provided', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    matDialog.open.and.returnValue(dialogRefSpy);

    dialogRefSpy.afterClosed.and.returnValue(of(mockStudent));
    const dispatchSpy = spyOn(store, 'dispatch');

    component.openStudentDialog(mockStudent);
    expect(matDialog.open).toHaveBeenCalledWith(StudentDialogComponent, { data: mockStudent });
    expect(dispatchSpy).toHaveBeenCalledWith(StudentsActions.editStudent({ id: mockStudent.id, payload: mockStudent }));
  });

  it('should dispatch deleteStudent action on deleteStudentById', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteStudentById(mockStudent.id);
    expect(dispatchSpy).toHaveBeenCalledWith(StudentsActions.deleteStudent({ id: mockStudent.id }));
  });

  it('should not dispatch deleteStudent action if confirm returns false', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteStudentById(mockStudent.id);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
