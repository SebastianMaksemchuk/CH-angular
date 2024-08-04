import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { MockProvider } from 'ng-mocks';
import { AuthService } from './auth.service';
import { User } from '../../shared/interfaces/user';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let router: Router;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MockProvider(Router)],
    });

    httpController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('logIn', () => {
    it('should log in and navigate to dashboard on successful login', (done) => {
      const mockUser: User = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'ADMIN',
        password: 'password', // La contraseña debe coincidir para el login exitoso
        token: 'mockToken',
      };
      const data = { email: 'john@example.com', password: 'password' };
      spyOn(router, 'navigate');
    
      service.logIn(data);
    
      const req = httpController.expectOne((req) => {
        return req.method === 'GET' &&
               req.url === `${environment.apiUrl}users` &&
               req.params.get('email') === data.email;
      });
    
      req.flush([mockUser]);
    
      expect(localStorage.getItem('token')).toBe('mockToken');
      expect(router.navigate).toHaveBeenCalledWith(['dashboard', 'home']);
      done();
    });

    it('should handle login with incorrect password', (done) => {
      const mockUser: User = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'ADMIN',
        password: 'correctpassword', // Contraseña correcta para el usuario pero incorrecta en el input
        token: 'mockToken',
      };
      const data = { email: 'john@example.com', password: 'wrongpassword' };
      spyOn(router, 'navigate');
    
      service.logIn(data);
    
      const req = httpController.expectOne((req) => {
        return req.method === 'GET' &&
               req.url === `${environment.apiUrl}users` &&
               req.params.get('email') === data.email;
      });
    
      req.flush([mockUser]);
    
      expect(localStorage.getItem('token')).toBeFalsy();
      expect(router.navigate).not.toHaveBeenCalled();
      done();
    });

    it('should handle login with incorrect password', (done) => {
      const mockUser: User = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'ADMIN',
        password: 'correctpassword', // Contraseña correcta para el usuario pero incorrecta en el input
        token: 'mockToken',
      };
      const data = { email: 'john@example.com', password: 'wrongpassword' };
      spyOn(router, 'navigate');
    
      service.logIn(data);
    
      const req = httpController.expectOne((req) => {
        return req.method === 'GET' &&
               req.url === `${environment.apiUrl}users` &&
               req.params.get('email') === data.email;
      });
    
      req.flush([mockUser]);
    
      expect(localStorage.getItem('token')).toBeFalsy();
      expect(router.navigate).not.toHaveBeenCalled();
      done();
    });

    

    it('should handle login errors', (done) => {
      const data = { email: 'john@example.com', password: 'password' };
      spyOn(router, 'navigate');
    
      service.logIn(data);
    
      const req = httpController.expectOne((req) => {
        return req.method === 'GET' &&
               req.url === `${environment.apiUrl}users` &&
               req.params.get('email') === data.email;
      });
    
      req.flush([], { status: 401, statusText: 'Unauthorized' });
    
      expect(localStorage.getItem('token')).toBeFalsy();
      expect(router.navigate).not.toHaveBeenCalled();
      done();
    });
    
  });

  describe('logOut', () => {
    it('should log out and navigate to login', () => {
      localStorage.setItem('token', 'mockToken');
      spyOn(router, 'navigate');

      service.logOut();

      expect(localStorage.getItem('token')).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['auth', 'login']);
    });
  });

  describe('verifyToken', () => {
    it('should return true for a valid token', (done) => {
      const mockUser: User = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'ADMIN',
        password: 'password',
        token: 'mockToken',
      };
      localStorage.setItem('token', 'mockToken');

      service.verifyToken().subscribe(isValid => {
        expect(isValid).toBeTrue();
        done();
      });

      const req = httpController.expectOne((req) => {
        return req.method === 'GET' && req.url === `${environment.apiUrl}users` && req.params.get('token') === 'mockToken';
      });

      req.flush([mockUser]);
    });

    it('should return false for an invalid token', (done) => {
      localStorage.setItem('token', 'invalidToken');

      service.verifyToken().subscribe(isValid => {
        expect(isValid).toBeFalse();
        done();
      });

      const req = httpController.expectOne((req) => {
        return req.method === 'GET' && req.url === `${environment.apiUrl}users` && req.params.get('token') === 'invalidToken';
      });

      req.flush([]);
    });

    it('should return false if no token is present', (done) => {
      localStorage.removeItem('token');

      service.verifyToken().subscribe(isValid => {
        expect(isValid).toBeFalse();
        done();
      });
    });
  });

  describe('registerUser', () => {
    it('should register a user and return the user', (done) => {
      const mockUser: User = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'ADMIN',
        password: 'password',
        token: 'mockToken',
      };

      service.registerUser(mockUser).subscribe(user => {
        expect(user).toEqual(mockUser);
        done();
      });

      const req = httpController.expectOne({
        url: `${environment.apiUrl}users`,
        method: 'POST',
      });

      req.flush(mockUser);
    });

    it('should handle registration errors', (done) => {
      const mockUser: User = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'ADMIN',
        password: 'password',
        token: 'mockToken',
      };

      service.registerUser(mockUser).subscribe(user => {
        expect(user).toBeNull();
        done();
      });

      const req = httpController.expectOne({
        url: `${environment.apiUrl}users`,
        method: 'POST',
      });

      req.flush({}, { status: 400, statusText: 'Bad Request' });
    });
  });
});
