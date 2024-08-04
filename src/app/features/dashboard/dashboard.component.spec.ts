import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../shared/interfaces/user';
import { MatDialog } from '@angular/material/dialog';

xdescribe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logOut']);
    authServiceSpy.authUser$ = of(null); // Simula que no hay usuario autenticado

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        MatDialog
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logOut method on AuthService', () => {
    component.logOut();
    expect(authService.logOut).toHaveBeenCalled();
  });

  it('should show alert when changeTheme is called', () => {
    spyOn(window, 'alert');
    component.changeTheme();
    expect(window.alert).toHaveBeenCalledWith('modo oscuro aún no implementado');
  });

  it('should have correct initial state', () => {
    expect(component.showFiller).toBeFalse();
    expect(component.main).toBe('start');
    component.authUser$.subscribe(user => {
      expect(user).toBeNull();
    });
  });
});
