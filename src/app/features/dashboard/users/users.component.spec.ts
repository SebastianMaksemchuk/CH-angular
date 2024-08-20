import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { UsersComponent } from './users.component';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { UsersActions } from './store/users.actions';
import { RootState } from '../../../core/store/store';
import { User, UserRole } from '../../../shared/interfaces/user';
import { SharedModule } from '../../../shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let store: MockStore<RootState>;
  let matDialog: jasmine.SpyObj<MatDialog>;
  let mockUser: User;

  const initialState = {
    users: [],
    usersError: null,
    usersIsLoading: false,
  };

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        NoopAnimationsModule,
      ],
      declarations: [UsersComponent],
      providers: [
        provideMockStore({ initialState }),
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    matDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    mockUser = {
      id: 'abcd',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      phone: '',
      adress: '',
      role: 'TEACHER',
      token: 'abcde12345'
    };
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadUsers action on ngOnInit', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.loadUsers());
  });

  it('should dispatch unsetUsersState action on ngOnDestroy', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.unsetUsersState());
  });

  it('should open user dialog and dispatch createUser if no user is provided', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    matDialog.open.and.returnValue(dialogRefSpy);

    dialogRefSpy.afterClosed.and.returnValue(of(mockUser));
    const dispatchSpy = spyOn(store, 'dispatch');

    component.openUserDialog();
    expect(matDialog.open).toHaveBeenCalledWith(UserDialogComponent, { data: undefined });
    expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.createUser({ payload: mockUser }));
  });

  it('should open user dialog and dispatch editUser if user is provided', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    matDialog.open.and.returnValue(dialogRefSpy);

    dialogRefSpy.afterClosed.and.returnValue(of(mockUser));
    const dispatchSpy = spyOn(store, 'dispatch');

    component.openUserDialog(mockUser);
    expect(matDialog.open).toHaveBeenCalledWith(UserDialogComponent, { data: mockUser });
    expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.editUser({ id: mockUser.id, payload: mockUser }));
  });

  it('should dispatch deleteUser action on deleteUserById', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteUserById(mockUser.id);
    expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.deleteUser({ id: mockUser.id }));
  });

  it('should not dispatch deleteUser action if confirm returns false', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteUserById(mockUser.id);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
