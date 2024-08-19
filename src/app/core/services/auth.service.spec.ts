import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import { User } from '../../shared/interfaces/user';
import { environment } from '../../../environments/environment';
import { AuthActions } from '../store/auth/auth.actions';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let storeSpy: jasmine.SpyObj<Store>;
  let mockUser: User;

  beforeEach(() => {
    const router = jasmine.createSpyObj('Router', ['navigate']);
    const store = jasmine.createSpyObj('Store', ['dispatch']);

    mockUser = {
      id: 'abcd',
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      phone: '',
      adress: '',
      password: 'Password123!',
      role: 'ADMIN',
      token: 'fakeToken'
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: router },
        { provide: Store, useValue: store },
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    storeSpy = TestBed.inject(Store) as jasmine.SpyObj<Store>;
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#logIn', () => {
    it('should log in the user with valid credentials and navigate to dashboard', () => {
      const loginData = { email: mockUser.email, password: mockUser.password };
      service.logIn(loginData);

      const req = httpMock.expectOne(`${environment.apiUrl}users?email=${mockUser.email}`);
      expect(req.request.method).toBe('GET');
      req.flush([mockUser]);

      expect(localStorage.getItem('token')).toBe(mockUser.token);
      expect(storeSpy.dispatch).toHaveBeenCalledWith(AuthActions.setAuthUser({ payload: mockUser }));
      expect(routerSpy.navigate).toHaveBeenCalledWith(['dashboard', 'home']);
    });

    it('should alert when credentials are incorrect', () => {
      spyOn(window, 'alert');
      const loginData = { email: mockUser.email, password: 'wrongPassword' };
      service.logIn(loginData);

      const req = httpMock.expectOne(`${environment.apiUrl}users?email=${mockUser.email}`);
      expect(req.request.method).toBe('GET');
      req.flush([mockUser]);

      expect(localStorage.getItem('token')).toBeNull();
      expect(window.alert).toHaveBeenCalledWith('Correo o contraseña incorrecta');
    });

    it('should alert when the user does not exist', () => {
      spyOn(window, 'alert');
      const loginData = { email: 'notfound@example.com', password: mockUser.password };
      service.logIn(loginData);

      const req = httpMock.expectOne(`${environment.apiUrl}users?email=notfound@example.com`);
      expect(req.request.method).toBe('GET');
      req.flush([]);

      expect(localStorage.getItem('token')).toBeNull();
      expect(window.alert).toHaveBeenCalledWith('Correo o contraseña incorrecta');
    });

    it('should alert on login error', () => {
      spyOn(window, 'alert');
      const loginData = { email: mockUser.email, password: mockUser.password };
      service.logIn(loginData);

      const req = httpMock.expectOne(`${environment.apiUrl}users?email=${mockUser.email}`);
      expect(req.request.method).toBe('GET');
      req.error(new ErrorEvent('network error'));

      expect(localStorage.getItem('token')).toBeNull();
      expect(window.alert).toHaveBeenCalledWith('Error en el inicio de sesión');
    });
  });

  describe('#logOut', () => {
    it('should clear the token and navigate to login', () => {
      localStorage.setItem('token', 'fakeToken');
      service.logOut();
      expect(localStorage.getItem('token')).toBeNull();
      expect(storeSpy.dispatch).toHaveBeenCalledWith(AuthActions.unsetAuthUser());
      expect(routerSpy.navigate).toHaveBeenCalledWith(['auth', 'login']);
    });
  });

  describe('#verifyToken', () => {
    it('should verify token and set auth user when valid', () => {
      localStorage.setItem('token', mockUser.token);
      service.verifyToken().subscribe(isValid => {
        expect(isValid).toBeTrue();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}users?token=${mockUser.token}`);
      expect(req.request.method).toBe('GET');
      req.flush([mockUser]);

      expect(storeSpy.dispatch).toHaveBeenCalledWith(AuthActions.setAuthUser({ payload: mockUser }));
    });

    it('should return false if token is invalid', () => {
      localStorage.setItem('token', 'invalidToken');
      service.verifyToken().subscribe(isValid => {
        expect(isValid).toBeFalse();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}users?token=invalidToken`);
      expect(req.request.method).toBe('GET');
      req.flush([]);

      expect(storeSpy.dispatch).not.toHaveBeenCalled();
    });

    it('should return false if there is an error during verification', () => {
      localStorage.setItem('token', mockUser.token);
      service.verifyToken().subscribe(isValid => {
        expect(isValid).toBeFalse();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}users?token=${mockUser.token}`);
      expect(req.request.method).toBe('GET');
      req.error(new ErrorEvent('network error'));

      expect(storeSpy.dispatch).not.toHaveBeenCalled();
    });

    it('should return false if no token is present', () => {
      localStorage.removeItem('token');
      service.verifyToken().subscribe(isValid => {
        expect(isValid).toBeFalse();
      });

      httpMock.expectNone(`${environment.apiUrl}users`);
    });
  });
});
