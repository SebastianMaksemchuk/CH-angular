import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/interfaces/user';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersUrl: string = environment.apiUrl + 'users';

  private _authUser$ = new BehaviorSubject<User | null>(null);
  authUser$ = this._authUser$.asObservable();

  constructor(private httpClient: HttpClient, private router: Router) { }
  logIn(data: { email: string; password: string }) {
    let params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    this.httpClient.get<User[]>(this.usersUrl, { params }).pipe(
      map(response => {
        if (response && response.length > 0) {
          const authUser = response[0];
          if (authUser.token) {
            localStorage.setItem('token', authUser.token);
            this._authUser$.next(authUser);
            this.router.navigate(['dashboard', 'home']);
          } else {
            console.error("Token no encontrado en la respuesta");
            alert("Error en el inicio de sesión");
          }
        } else {
          console.log("Correo o contraseña incorrecta");
          alert("Correo o contraseña incorrecta");
        }
      }),
      catchError(err => {
        console.error(err);
        alert("Error en el inicio de sesión");
        return of(null);
      })
    ).subscribe();
  }

  logOut() {
    localStorage.removeItem('token');
    this._authUser$.next(null);
    this.router.navigate(['auth', 'login']);
  }

  verifyToken(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of(false);
    }
    let params = new HttpParams().set('token', token);
    return this.httpClient.get<User[]>(this.usersUrl, { params }).pipe(
      map(response => {
        if (response && response.length > 0) {
          const authUser = response[0];
          if (authUser.token) {
            localStorage.setItem('token', authUser.token);
            this._authUser$.next(authUser);
            return true;
          }
        }
        return false;
      }),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }

  registerUser(user: User): Observable<User | null> {
    user.role = undefined;
    user.token = this.generateToken(10);

    return this.httpClient.post<User>(this.usersUrl, user).pipe(
      map(response => {
        console.log('Usuario registrado con éxito:', response);
        return response;
      }),
      catchError(err => {
        console.error(err);
        alert("Error en el registro de usuario");
        return of(null);
      })
    );
  }

  private generateToken(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}