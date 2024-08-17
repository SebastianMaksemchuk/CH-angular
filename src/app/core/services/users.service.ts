import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { User } from '../../shared/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersUrl: string = environment.apiUrl + 'users';

  constructor(
    private httpClient: HttpClient
  ) { }

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.usersUrl)
  }

  createUser(payload: User): Observable<User> {
    const { id, ...user } = payload;
    user.token = this.generateToken(10);
    return this.httpClient.post<User>(this.usersUrl, user);
  }

  generateToken(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  editUserById(id:string, editedUser: User): Observable<User> {
    return this.httpClient.put<User>(`${this.usersUrl}/${id}`, editedUser)
  }

  deleteUserById(id:string): Observable<User> {
    return this.httpClient.delete<User>(`${this.usersUrl}/${id}`)
  }
}
