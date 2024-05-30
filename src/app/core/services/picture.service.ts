import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PictureService {
  private url = `${environment.pictureApi}/pictures`;

  constructor(private http: HttpClient) {}

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

  getImageById(imageId: number): Observable<Blob> {
    return this.http.get(`${this.url}/${imageId}`, { responseType: 'blob' });
  }

  getUserPicture(userId: number): Observable<Blob> {
    return this.http.get(`${this.url}/user/${userId}`, { responseType: 'blob' });
  }

  // formdata for file?
  updateUserPicture(userId: number, file: File): Observable<any> {

    const formData = new FormData();
    formData.append("file", file, file.name)

    return this.http
      .post(`${this.url}/user/${userId}`, formData, this.getHttpOptions());
  }

}
