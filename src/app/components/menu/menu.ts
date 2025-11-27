import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {
  title = 'Gourpet';
  user = 'Usuario';
  userRole: string = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem('userId');

    if (token && userId) {
      this.userService.getOneUser(token, userId).subscribe(
        (userData) => {
          this.userRole = userData.rol;
          this.user = userData.nombre_usuario;
        },
        (error) => console.error('Error al obtener rol en menú', error)
      );
    }
  }
}
