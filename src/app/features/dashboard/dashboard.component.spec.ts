import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '../../shared/shared.module';
import { CoursesModule } from './courses/courses.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { StudentsModule } from './students/students.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ActivatedRoute } from '@angular/router';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logOut']);
    authServiceSpy.authUser$ = of(null); // Simula que no hay usuario autenticado

    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);
    activatedRouteSpy.snapshot = {
      paramMap: {
        get: jasmine.createSpy().and.returnValue('1')
      }
    } as any;

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        CommonModule,
        DashboardRoutingModule,
        SharedModule,
        CoursesModule,
        StudentsModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatListModule,
        MatTooltipModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        MatDialog,
        provideAnimationsAsync()
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


  it('should have correct initial state', () => {
    expect(component.showFiller).toBeFalse();
    expect(component.main).toBe('start');
    component.authUser$.subscribe(user => {
      expect(user).toBeNull();
    });
  });
});
