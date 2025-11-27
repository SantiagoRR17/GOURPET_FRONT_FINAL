import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUri = '/api';

  constructor(private http: HttpClient) { }

  getUsers(token: any): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUri}/usuarios`, {
      headers: {
        'Content-Type': 'application/json',
        accessToken: `${token}`
      }
    });
  }

  getUsersCount(token: any): Observable<any> {
    return this.http.get<any>(`${this.apiUri}/usuarios/count`, {
      headers: {
        'Content-Type': 'application/json',
        accessToken: `${token}`
      }
    });
  }

  newUser(token: any, data: User): Observable<User> {
    return this.http.post<User>(
      `${this.apiUri}/usuarios`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          accessToken: `${token}`
        }
      });
  }

  updateUser(token: any, id: any, data: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUri}/usuarios/${id}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          accessToken: `${token}`
        }
      });
  }

  getOneUser(token: any, id: any): Observable<User> {
    return this.http.get<User>(
      `${this.apiUri}/usuarios/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          accessToken: `${token}`
        }
      });
  }

  deleteUser(token: any, id: any) {
    return this.http.delete<any>(
      `${this.apiUri}/usuarios/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          accessToken: `${token}`
        }
      });
  }
}
