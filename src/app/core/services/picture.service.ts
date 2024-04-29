import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PictureService {
  private imageUrl = 'http://localhost:8091/api/pictures';

  constructor(private http: HttpClient) {}

  getImageById(imageId: number): Observable<Blob> {
    return this.http.get(`${this.imageUrl}/${imageId}`, { responseType: 'blob' });
  }

  getUserPicture(userId: number): Observable<Blob> {
    return this.http.get(`${this.imageUrl}/user/${userId}`, { responseType: 'blob' });
  }

}
