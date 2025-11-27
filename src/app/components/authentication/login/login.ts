import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Authentication } from '../../../services/authentication';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private renderer: Renderer2,
    private authenticationService: Authentication,
    private router: Router) { }

  ngOnInit() {
    // Usa Renderer2 para añadir la clase de forma segura
    // Este estilo 'bg-gradient-primary' hace que el fondo sea azul
    this.renderer.addClass(document.body, 'bg-gradient-primary');
  }

  onLogin(form: any): void {
    this.authenticationService.login(form.value).subscribe({
      next: (res) => {
        if (res && res.accessToken) {
          localStorage.setItem('accessToken', res.accessToken);
          
          // Decodificar el token para obtener el ID del usuario
          const tokenPayload = this.parseJwt(res.accessToken);
          if (tokenPayload && tokenPayload.id) {
            localStorage.setItem('userId', tokenPayload.id);
          }

          this.router.navigateByUrl('/recetas');
        } else {
          console.error('La respuesta no contiene el token esperado:', res);
          alert('Error en el inicio de sesión: No se recibió el token.');
        }
      },
      error: (err) => {
        console.error('Error en el login:', err);
        alert('Error al iniciar sesión. Verifica tus credenciales.');
      }
    });
  }

  parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }
}
