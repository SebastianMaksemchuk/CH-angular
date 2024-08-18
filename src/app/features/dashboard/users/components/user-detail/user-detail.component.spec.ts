import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { UserDetailComponent } from './user-detail.component';
import { User } from '../../../../../shared/interfaces/user';
import { RootState } from '../../../../../core/store/store';
import { UsersActions } from '../../store/users.actions';
import { selectUsers, selectUsersError, selectUsersIsLoading, selectSelectedUser } from '../../store/users.selectors';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../../../../shared/shared.module';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let store: MockStore<RootState>;
  let mockActivatedRoute: any;

  const initialState = {
    users: { users: [], isLoading: false, error: null, selectedUser: null }
  };

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: { paramMap: new Map([['id', 'abcd']]) }
    };

    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule,
        StoreModule.forRoot({})
      ],
      declarations: [UserDetailComponent],
      providers: [
        provideMockStore({ initialState }),
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore<RootState>;
    store.overrideSelector(selectUsers, []);
    store.overrideSelector(selectUsersError, null);
    store.overrideSelector(selectUsersIsLoading, false);
    store.overrideSelector(selectSelectedUser, null);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadUsers and loadUserById on init', () => {
    spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(UsersActions.loadUsers());
    expect(store.dispatch).toHaveBeenCalledWith(UsersActions.loadUserById({ id: 'abcd' }));
  });

  it('should dispatch unsetUsersState on destroy', () => {
    spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(UsersActions.unsetUsersState());
  });
  
});
