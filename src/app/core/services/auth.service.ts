import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;

  private authUrl = 'http://localhost:8090/api/auth'


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

  login(username: string, password: string): Observable<boolean> {
    const loginDto = {
      username: username,
      password: password,
    };
  
    return this.authenticate(loginDto).pipe(
      
      map((token: { token: string; }) => {
        if (token) {
          localStorage.setItem('username', username);
          localStorage.setItem('token', token.token);
          this.isAuthenticated = true;
          window.location.href = '/';
          return true;
        } else {
          return false;
        }
      }),
      catchError((error) => {
        console.error('Authentication error:', error);
        return of(false); // Return an observable with a value of false
      })
    );
  }

  authenticate(loginDto: any): Observable<any>{ // backend returns object with token: <token>
    const url = `${this.authUrl}/login`
    return this.http
    .post<string>(url, loginDto, this.getHttpOptions()) // why get http options here w/e
    .pipe(catchError(this.handleError<string>("login")));
  }

  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    this.isAuthenticated = false;
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
    return localStorage.getItem('token') !== null;
    // for testing
    // return this.isAuthenticated;
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }

}
