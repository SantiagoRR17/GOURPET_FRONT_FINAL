import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Receta } from '../models/receta';

@Injectable({
  providedIn: 'root',
})
export class RecetaService {
  apiUri = '/api';

  constructor(private http: HttpClient) { }

  getAllRecetas(token: any): Observable<Receta[]> {
    return this.http.get<Receta[]>(`${this.apiUri}/recetas`, {
      headers: {
        'Content-Type': 'application/json',
        accessToken: `${token}`
      }
    });
  }

  searchRecetas(token: any, campo: string, valor: string): Observable<Receta[]> {
    return this.http.get<Receta[]>(`${this.apiUri}/recetas/buscar`, {
      headers: {
        'Content-Type': 'application/json',
        accessToken: `${token}`
      },
      params: {
        campo: campo,
        valor: valor
      }
    });
  }

  newReceta(token: any, data: Receta): Observable<Receta> {
    return this.http.post<Receta>(
      `${this.apiUri}/receta`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          accessToken: `${token}`
        }
      });
  }

  updateReceta(token: any, id: any, data: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUri}/recetas/${id}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          accessToken: `${token}`
        }
      });
  }

  getOneReceta(token: any, id: any): Observable<Receta> {
    return this.http.get<Receta>(
      `${this.apiUri}/recetas/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          accessToken: `${token}`
        }
      });
  }

  deleteReceta(token: any, id: any) {
    return this.http.delete<any>(
      `${this.apiUri}/recetas/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          accessToken: `${token}`
        }
      });
  }
}
