import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PictureService {
  private url = `${environment.pictureApi}/pictures`;

  constructor(private http: HttpClient) {}

  getImageById(imageId: number): Observable<Blob> {
    return this.http.get(`${this.url}/${imageId}`, { responseType: 'blob' });
  }

  getUserPicture(userId: number): Observable<Blob> {
    return this.http.get(`${this.url}/user/${userId}`, { responseType: 'blob' });
  }

}
