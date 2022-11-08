import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Response } from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private baseUrl = environment.baseUrl;
  private baseAuthUrl = environment.baseAuthUrl;

  constructor(private http: HttpClient) {}

  get<T, K>(endpoint: string, data: K): Observable<Response<T>> {
    return this.http.post<Response<T>>(
      `${this.baseUrl}${endpoint}${this.getCurrentRoute()}`,
      data
    );
  }

  getRequest<T, K>(endpoint: string) {
    return this.http.get<Response<T>>(
      `${this.baseUrl}${endpoint}${this.getCurrentRoute()}`
    );
  }

  getAuth<T, K>(endpoint: string, data: K): Observable<Response<T>> {
    return this.http.post<Response<T>>(
      `${this.baseAuthUrl}${endpoint}${this.getCurrentRoute()}`,
      data
    );
  }

  getOne<T, K>(endpoint: string, id: string): Observable<Response<T>> {
    return this.http.get<Response<T>>(`${this.baseUrl}${endpoint}/${id}`);
  }

  delete<T, K>(
    endpoint: string,
    id: number,
    baseUrl: string = this.baseUrl
  ): Observable<Response<T>> {
    return this.http.delete<Response<T>>(`${baseUrl}${endpoint}/${id}`);
  }

  getCurrentRoute() {
    let route = window.location.href;
    if (route && route.includes('/')) {
      let currentRoute = route.split('/');
      route = currentRoute[currentRoute.length - 1];
      const source = `?source=${route}`;
      return source;
    }
  }
}
