// src/app/components/favoritos/list/favoritoslist.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritosService } from '../../../services/favoritos.service';
import { Favorito } from '../../../models/favorito';

@Component({
  selector: 'app-favoritos-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favoritoslist.component.html',
  styleUrl: './favoritoslist.component.css',
})
export class FavoritosListComponent implements OnInit {

  favoritos: Favorito[] = [];

  constructor(private favoritosService: FavoritosService) {}

  ngOnInit(): void {
    this.cargarFavoritos();
  }

  cargarFavoritos() {
    this.favoritosService.getFavoritos().subscribe({
      next: (res) => {
        console.log('Favoritos recibidos:', res);
        this.favoritos = res;
      },
      error: (err) => {
        console.error('Error al cargar favoritos:', err);
      }
    });
  }

  eliminarFavorito(id?: string) {
    if (!id) return;

    this.favoritosService.deleteFavorito(id).subscribe({
      next: () => {
        this.favoritos = this.favoritos.filter(f => f._id !== id);
      },
      error: (err) => {
        console.error('Error al eliminar favorito', err);
      }
    });
  }
}
