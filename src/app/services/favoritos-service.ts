// src/app/services/favoritos.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Favorito } from '../models/favorito';

@Injectable({
  providedIn: 'root',
})
export class FavoritosService {

  private apiUri = '/api/favoritos';

  constructor(
    private http: HttpClient,
  ) {}

  /** Obtener lista de favoritos del usuario actual */
  getFavoritos(token: any, userId?: any): Observable<Favorito[]> {
    let url = this.apiUri;
    if (userId) {
      url += `?usuario=${userId}`;
    }
    
    return this.http.get<Favorito[]>(url, {
      headers: {
        'Content-Type': 'application/json',
        accessToken: `${token}`,
      },
    });
  }

  /** Agregar un favorito nuevo */
  addFavorito(token: any, data: Partial<Favorito>): Observable<Favorito> {
    return this.http.post<Favorito>(this.apiUri, data, {
      headers: {
        'Content-Type': 'application/json',
        accessToken: `${token}`,
      },
    });
  }

  /** Eliminar favorito por ID */
  deleteFavorito(token: any, id: string): Observable<any> {
    return this.http.delete(`${this.apiUri}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        accessToken: `${token}`,
      },
    });
  }
}

