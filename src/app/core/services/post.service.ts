import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private url = `${environment.postApi}/posts`;

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

  getUserPosts(userId: number): Observable<Post[]> {
    return this.http
      .get<Post[]>(`${this.url}/user/${userId}`, this.getHttpOptions())
      .pipe(catchError(this.handleError<Post[]>('getPostsByUserId')));
  }

  getPublicPosts(page: number, size: number = 10): Observable<any> {
    let params = new HttpParams();
    const url = `${this.url}/scroll/public`;

    params = params.append('page', page.toString());
    params = params.append('size', size.toString());

    return this.http.get<any>(`${url}`, { params });
  }

  createNewPost(post: Post, photos: File[]): Observable<any> {
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

  updatePost(id: number, post: Post): Observable<any> {
    const url = `${this.url}/${id}`;
    return this.http
      .put(url, post, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('editPost')));

  }

  deletePost(id: number): Observable<any> {
    const url = `${this.url}/${id}`;
    return this.http
      .delete(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('deletePost')));


  }

  addComment(postId: number, commentText: string):Observable<any> {
    const url = `${this.url}/${postId}/comment`;

    return this.http
      .post(url, commentText, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('addComment')));
  }

  // edit comment --- last
  editComment(id:number, text: string): Observable<any> {
    const url = `${this.url}/comment/${id}`;
    return this.http
      .put(url, text, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('editComment')));
  }

  // delete comment
  deleteComment(id: number): Observable<any> {
    const url = `${this.url}/comment/${id}`;
    return this.http
      .delete(url, this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('deleteComment')));

  }


  // like post
  likePost(postId: number):Observable<any> {
    const url = `${this.url}/${postId}/like`;

    return this.http
      .post(url, [], this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('like post')));
  }

  starPost(postId: number):Observable<any> {
    const url = `${this.url}/${postId}/star`;

    return this.http
      .post(url, [], this.getHttpOptions())
      .pipe(catchError(this.handleError<any>('star post')));
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }

}
