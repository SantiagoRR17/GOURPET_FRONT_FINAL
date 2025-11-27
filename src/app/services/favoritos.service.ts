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
  getFavoritos(): Observable<Favorito[]> {
    const token = localStorage.getItem('ACCESS_TOKEN');
    return this.http.get<Favorito[]>(this.apiUri, {
      headers: {
        'Content-Type': 'application/json',
        accessToken: `${token}`,
      },
    });
  }

  /** Agregar un favorito nuevo */
  addFavorito(data: Partial<Favorito>): Observable<Favorito> {
    const token = localStorage.getItem('ACCESS_TOKEN');
    return this.http.post<Favorito>(this.apiUri, data, {
      headers: {
        'Content-Type': 'application/json',
        accessToken: `${token}`,
      },
    });
  }

  /** Eliminar favorito por ID */
  deleteFavorito(id: string): Observable<any> {
    const token = localStorage.getItem('ACCESS_TOKEN');
    return this.http.delete(`${this.apiUri}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        accessToken: `${token}`,
      },
    });
  }
}

