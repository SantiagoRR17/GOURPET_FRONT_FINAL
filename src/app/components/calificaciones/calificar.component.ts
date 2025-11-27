import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalificacionesService } from '../../services/calificaciones-service';

@Component({
  selector: 'app-calificar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calificar.component.html',
  styleUrl: './calificar.component.css'
})
export class CalificarComponent {
  recetaId: string = '';
  puntaje: number = 1;
  comentario: string = '';

  constructor(private calificacionesService: CalificacionesService) {}

  enviarCalificacion() {
    const data = {
      receta: this.recetaId,
      puntaje: this.puntaje,
      comentario: this.comentario
    };

    this.calificacionesService.crearCalificacion(data).subscribe({
      next: (res) => {
        console.log('Calificación creada:', res);
        alert('¡Calificación enviada con éxito!');
      },
      error: (err) => {
        console.error(err);
        alert('Error al enviar calificación');
      }
    });
  }
}
