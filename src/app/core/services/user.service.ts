import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = 'http://localhost:8090/api/users';

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

  constructor(private http: HttpClient) {}

  updateUser(user: User): Observable<User> {
    const url = `${this.url}/${user.id}`;
    return this.http
      .put<User>(url, user, this.getHttpOptions())
      .pipe(catchError(this.handleError<User>('updateUser')));
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
