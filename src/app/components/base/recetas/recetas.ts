import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecetaService } from '../../../services/receta-service';
import { UserService } from '../../../services/user-service';
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Menu } from '../../menu/menu';
import { Receta } from '../../../models/receta';

@Component({
  selector: 'app-recetas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Menu],
  templateUrl: './recetas.html',
  styleUrl: './recetas.css',
})
export class Recetas {

  constructor(private recetaService: RecetaService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService) {
  }

  titlePage: string = 'Recetas';
  recetaList: Receta[] = [];
  allRecetas: Receta[] = []; // Copia de todas las recetas para filtrado local
  recetaForm!: FormGroup;
  searchForm!: FormGroup;
  editableReceta: boolean = false;
  idReceta: any;
  user = 'Usuario';
  userRole: string = '';
  currentUserId: string | null = '';

  ngOnInit() {
    const token = localStorage.getItem("accessToken");
    this.currentUserId = localStorage.getItem('userId');

    if (token) {
      // Obtener rol del usuario
      if (this.currentUserId) {
        this.userService.getOneUser(token, this.currentUserId).subscribe(
          (userData) => {
            this.userRole = userData.rol;
            this.user = userData.nombre_usuario;
          },
          (error) => console.error('Error al obtener rol', error)
        );
      }

      this.recetaForm = this.formBuilder.group({
        nombre: ['', Validators.required],
        descripcion: ['', Validators.required],
        ingredientes: ['', Validators.required],
        tipo_dieta: ['convencional', Validators.required],
        especie: ['perro'],
        publicada: [true]
      });

      this.searchForm = this.formBuilder.group({
        campo: ['nombre', Validators.required],
        valor: ['', Validators.required]
      });

      this.getAllRecetas();
    } else {
      this.router.navigate(['/login'])
    }
  }

  getAllRecetas() {
    this.recetaService.getAllRecetas(localStorage.getItem('accessToken')).subscribe(
      (data: Receta[]) => {
        this.recetaList = data;
        this.allRecetas = data; // Guardamos la copia completa
        console.log(data);
      }
    );
  }

  searchRecetas() {
    if (this.searchForm.invalid) {
      this.toastr.warning('Por favor ingresa un valor para buscar', 'Advertencia');
      return;
    }
    const { campo, valor } = this.searchForm.value;
    const valorBusqueda = valor.toLowerCase();

    // Filtrado local
    this.recetaList = this.allRecetas.filter(receta => {
      const valorCampo = (receta as any)[campo];
      if (typeof valorCampo === 'string') {
        return valorCampo.toLowerCase().includes(valorBusqueda);
      }
      return false;
    });

    if (this.recetaList.length === 0) {
      this.toastr.info('No se encontraron recetas con ese criterio', 'Información');
    }
  }

  clearSearch() {
    this.searchForm.reset({ campo: 'nombre', valor: '' });
    this.recetaList = [...this.allRecetas]; // Restauramos la lista completa
  }

  newRecetaEntry() {
    if (this.recetaForm.invalid) {
      this.toastr.error('Por favor completa todos los campos requeridos', 'Error');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.toastr.error('No se pudo identificar al usuario creador', 'Error');
      return;
    }

    const newReceta: Receta = {
      ...this.recetaForm.value,
      creada_por: userId
    };

    this.recetaService.newReceta(localStorage.getItem('accessToken'), newReceta).subscribe(
      () => {
        this.router.navigate(['/recetas']).then(() => {
          this.newMessage('Receta creada exitosamente');
        })
      },
      (error) => {
        console.error(error);
        this.toastr.error('Error al crear la receta', 'Error');
      }
    );
  }

  newMessage(messageText: string) {
    this.toastr.success('Clic aquí para actualizar la lista', messageText)
      .onTap
      .pipe(take(1))
      .subscribe(() => window.location.reload());
  }

  updateRecetaEntry() {
    if (this.recetaForm.invalid) {
      this.toastr.error('Por favor completa todos los campos requeridos', 'Error');
      return;
    }

    this.recetaService.updateReceta(localStorage.getItem('accessToken'), this.idReceta, this.recetaForm.value).subscribe(
      () => {
        this.newMessage("Receta editada");
        this.editableReceta = false;
        this.recetaForm.reset();
      },
      (error) => {
        console.error(error);
        this.toastr.error('Error al editar la receta', 'Error');
      }
    );
  }

  toggleEditReceta(id: any) {
    this.idReceta = id;
    this.recetaService.getOneReceta(localStorage.getItem('accessToken'), id).subscribe(
      data => {
        this.recetaForm.patchValue({
          nombre: data.nombre,
          descripcion: data.descripcion,
          ingredientes: data.ingredientes,
          tipo_dieta: data.tipo_dieta,
          especie: data.especie,
          publicada: data.publicada
        });
        this.editableReceta = true;
      }
    );
  }

  deleteRecetaEntry(id: any) {
    if(confirm("¿Estás seguro de eliminar esta receta?")) {
      this.recetaService.deleteReceta(localStorage.getItem('accessToken'), id).subscribe(
        () => {
          this.newMessage("Receta eliminada");
        },
        (error) => {
          console.error(error);
          this.toastr.error('Error al eliminar la receta', 'Error');
        }
      );
    }
  }

  cancelEdit() {
    this.editableReceta = false;
    this.recetaForm.reset();
  }
}
