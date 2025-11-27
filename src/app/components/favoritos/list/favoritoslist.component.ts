// src/app/components/favoritos/list/favoritoslist.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritosService } from '../../../services/favoritos-service';
import { Favorito } from '../../../models/favorito';
import { Menu } from '../../menu/menu';
import { UserService } from '../../../services/user-service';
import { RecetaService } from '../../../services/receta-service';

@Component({
  selector: 'app-favoritos-list',
  standalone: true,
  imports: [CommonModule, Menu],
  templateUrl: './favoritoslist.component.html',
  styleUrl: './favoritoslist.component.css',
})
export class FavoritosListComponent implements OnInit {

  favoritos: Favorito[] = [];
  user: string = 'Usuario';
  userRole: string = '';

  constructor(
    private favoritosService: FavoritosService,
    private userService: UserService,
    private recetaService: RecetaService
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo() {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      this.userService.getOneUser(token, userId).subscribe(
        (userData) => {
          this.user = userData.nombre_usuario;
          this.userRole = userData.rol;
          this.cargarFavoritos(); // Cargamos favoritos después de saber el rol
        },
        (error) => console.error('Error al obtener usuario', error)
      );
    }
  }

  cargarFavoritos() {
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    
    if (token) {
      // Si es admin, pasamos null para traer todos. Si no, pasamos el userId.
      const idToFilter = this.userRole === 'administrador' ? null : userId;

      this.favoritosService.getFavoritos(token, idToFilter).subscribe({
        next: (res) => {
          console.log('Favoritos recibidos:', res);
          this.favoritos = res;
          this.enrichFavoritosData(); // Enriquecer datos si vienen solo IDs
        },
        error: (err) => {
          console.error('Error al cargar favoritos:', err);
        }
      });
    }
  }

  enrichFavoritosData() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    this.favoritos.forEach(fav => {
      // Si la receta es solo un ID (string), buscamos sus detalles
      if (typeof fav.receta === 'string') {
        this.recetaService.getOneReceta(token, fav.receta).subscribe(
          (data) => { fav.receta = data; },
          (err) => console.error('Error cargando receta', err)
        );
      }

      // Si el usuario es solo un ID y somos admin, buscamos sus detalles
      if (this.userRole === 'administrador' && typeof fav.usuario === 'string') {
        this.userService.getOneUser(token, fav.usuario).subscribe(
          (data) => { fav.usuario = data; },
          (err) => console.error('Error cargando usuario', err)
        );
      }
    });
  }

  eliminarFavorito(id?: string) {
    if (!id) return;
    const token = localStorage.getItem('accessToken');

    this.favoritosService.deleteFavorito(token, id).subscribe({
      next: () => {
        this.favoritos = this.favoritos.filter(f => f._id !== id);
      },
      error: (err) => {
        console.error('Error al eliminar favorito', err);
      }
    });
  }
}
