// src/app/services/calificaciones.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Calificacion } from '../models/calificacion';

@Injectable({
  providedIn: 'root',
})
export class CalificacionesService {

  private apiUri = '/api/calificaciones';

  constructor(private http: HttpClient) {}

  /** Crear una nueva calificación */
  crearCalificacion(data: Partial<Calificacion>): Observable<Calificacion> {
    const token = localStorage.getItem('ACCESS_TOKEN');
    return this.http.post<Calificacion>(this.apiUri, data, {
      headers: {
        'Content-Type': 'application/json',
        accessToken: `${token}`,
      },
    });
  }

  /** Obtener todas las calificaciones (opcional, para pruebas) */
  getCalificaciones(): Observable<Calificacion[]> {
    const token = localStorage.getItem('ACCESS_TOKEN');
    return this.http.get<Calificacion[]>(this.apiUri, {
      headers: {
        'Content-Type': 'application/json',
        accessToken: `${token}`,
      },
    });
  }

  /** (Opcional) Obtener calificaciones por receta más adelante */
  getCalificacionesPorReceta(recetaId: string): Observable<Calificacion[]> {
    const token = localStorage.getItem('ACCESS_TOKEN');
    // Si más adelante crean un endpoint tipo /calificaciones/receta/:id
    return this.http.get<Calificacion[]>(`${this.apiUri}?receta=${recetaId}`, {
      headers: {
        'Content-Type': 'application/json',
        accessToken: `${token}`,
      },
    });
  }
}
