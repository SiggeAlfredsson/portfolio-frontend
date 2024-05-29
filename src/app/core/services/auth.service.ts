import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, catchError, map, of, tap } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../../enviroments/enviroment';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = `${environment.userApi}/auth`;
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

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
  

  constructor(private http: HttpClient) { }
  private userSubscription?: Subscription;

  login(username: string, password: string): Observable<boolean> {
    const loginDto = { username, password };
    return this.http.post<any>(`${this.authUrl}/login`, loginDto, this.getHttpOptions())
      .pipe(
        map(response => {
          if (response) {
            this.currentUserSubject.next(response.user);
            localStorage.setItem('token', response.token);
            window.location.href = '/';
            return true;
          }
          return false;
        }),
        catchError((error) => {
          console.error('Authentication error:', error);
          return of(false);
        })
      );
  }


  validateJwtToken(token: string): Observable<boolean> {
    const url = `${this.authUrl}/token`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(url, (token), { headers: headers })
      .pipe(
        map(response => {
          this.currentUserSubject.next(response);
          return true;
        }),
        catchError(error => {
          this.logout()
          return of(false);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  register(username: string, password: string): Observable<any> {
    const registerDto = {
      username: username,
      password: password
    };
  
    return this.http.post<any>(`${this.authUrl}/register`, registerDto, this.getHttpOptions()) // or here??
      .pipe(catchError(this.handleError<any>('register')));
  }

  isAuth() {
    return localStorage.getItem("token") !== null
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }

}
