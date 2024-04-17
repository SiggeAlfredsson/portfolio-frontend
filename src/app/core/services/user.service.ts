import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'http://localhost:8090/api/users'

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any[]> {
    return this.http
      .get<any[]>(this.url)
      .pipe(catchError(this.handleError<any[]>('getUsers', [])));
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }
}
