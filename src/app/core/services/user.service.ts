import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = `${environment.userApi}/users`;

  private getHttpOptions() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      // 'Content-Type': 'application/json', happens automatically
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return { headers };
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService,

  ) {}

  updateUser(user: User): Observable<User> {
    const url = `${this.url}/update/${user.id}`;
    return this.http
      .put<any>(url, user, this.getHttpOptions())
      .pipe(
        tap(response => {
          if (response && response.token) {
            // Update the token in local storage and current user
            localStorage.setItem('token', response.token);
            this.authService.validateJwtToken(response.token).subscribe();
            return response.user;
          } else {
            return response; // if no token is included, the response is just the user
          }
        }),
        map(response => response.user || response), // handle both cases
        catchError(this.handleError<User>('updateUser'))
      );
  }
  

  getUserByUsername(username: string): Observable<User> {
    const url = `${this.url}/username/${username}`;
    return this.http
      .get<User>(url)
      .pipe(catchError(this.handleError<User>('getUser')));
  }

  getUserById(userId: number): Observable<User> {
    const url = `${this.url}/${userId}`;
    return this.http
      .get<User>(url)
      .pipe(catchError(this.handleError<User>('getUser')));
  }

  getAllUsers(): Observable<any[]> {
    return this.http
      .get<any[]>(this.url)
      .pipe(catchError(this.handleError<any[]>('getUsers', [])));
  }

  followUser(followId: number): Observable<any> {
    const url = `${this.url}/follow/${followId}`;
    return this.http
      .post(url, null, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('followUser')));
  }

  unFollowUser(followId: number): Observable<any> {
    const url = `${this.url}/unfollow/${followId}`;
    return this.http
      .delete(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('unFollowUser')));
  }

  getMyFollowings(): Observable<number[]> {
    const url = `${this.url}/my-followings`;
    return this.http
      .get<number[]>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<number[]>('getMyFollowings')));
  }

  convertIdsToUsers(ids: number[]): Observable<User[]> {
    const url = `${this.url}/convert-ids`;
    return this.http
      .post<User[]>(url, ids, this.getHttpOptions())
      .pipe(catchError(this.handleError<User[]>('convertIds')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }
}
