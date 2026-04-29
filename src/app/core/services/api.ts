import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  get<T>(path: string) {
    return this.http.get<T>(`${this.base}/${path}/`);
  }

  post<T>(path: string, body: any) {
    return this.http.post<T>(`${this.base}/${path}/`, body);
  }

  patch<T>(path: string, id: number, body: any) {
    return this.http.patch<T>(`${this.base}/${path}/${id}/`, body);
  }

  delete<T>(path: string, id: number) {
    return this.http.delete<T>(`${this.base}/${path}/${id}/`);
  }
}