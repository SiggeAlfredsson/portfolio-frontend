import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private url = 'http://localhost:8092/api/posts'

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

  getPostById(id: number): Observable<Post> {
    const url = `${this.url}/${id}`;
    return this.http
      .get<Post>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<Post>('getPostById')));
  }

  getUserPosts(username: string): Observable<Post[]> {
    return this.http
      .get<Post[]>(`${this.url}/user/${username}`, this.getHttpOptions())
      .pipe(catchError(this.handleError<Post[]>('getPostsByUsername')));

  }

  createNewPost(post: Post, photos: File[]): Observable<any> {
    console.log(post)
    const formData = new FormData();
    formData.append('post', new Blob([JSON.stringify(post)], {
      type: "application/json"
    }));

    // Append each photo to the FormData
    photos.forEach(photo => {
      formData.append('files', photo, photo.name);
    });



    return this.http.post(this.url, formData, this.getHttpOptions());
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }

}
