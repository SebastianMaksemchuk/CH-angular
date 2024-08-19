import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsersService } from './users.service';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/interfaces/user';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;
  const usersUrl = `${environment.apiUrl}users`;

  let mockUser: User;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService],
    });

    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);

    mockUser = {
      id: 'abcd',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '',
      adress: '',
      password: 'Password123!',
      role: 'TEACHER',
      token: 'abcde12345'
    };
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getUsers', () => {
    it('should return an Observable of Users', () => {
      const mockUsers: User[] = [mockUser];
      service.getUsers().subscribe(users => {
        expect(users.length).toBe(1);
        expect(users[0]).toEqual(mockUser);
      });

      const req = httpMock.expectOne(usersUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });
  });

  describe('#createUser', () => {
    it('should create a new user and return it', () => {
      const newUser = { ...mockUser, id : 'efgh' };
      service.createUser(newUser).subscribe(user => {
        expect(user).toEqual({ ...newUser, token: mockUser.token });
      });

      const req = httpMock.expectOne(usersUrl);
      expect(req.request.method).toBe('POST');
      req.flush({ ...newUser, token: mockUser.token });
    });
  });

  describe('#getUserById', () => {
    it('should return an Observable of a User by ID', () => {
      service.getUserById(mockUser.id).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${usersUrl}/${mockUser.id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('#editUserById', () => {
    it('should update a user by ID and return it', () => {
      service.editUserById(mockUser.id, mockUser).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${usersUrl}/${mockUser.id}`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockUser);
    });
  });

  describe('#deleteUserById', () => {
    it('should delete a user by ID and return the deleted user', () => {
      service.deleteUserById(mockUser.id).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${usersUrl}/${mockUser.id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockUser);
    });
  });
});
