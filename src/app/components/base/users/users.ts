import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Menu } from '../../menu/menu';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Menu],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  titlePage: string = 'Usuarios';
  userList: User[] = [];
  allUsers: User[] = [];
  userForm!: FormGroup;
  searchForm!: FormGroup;
  editableUser: boolean = false;
  idUser: any;
  currentUser = 'Usuario';

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    const token = localStorage.getItem("accessToken");

    if (token) {
      this.userForm = this.formBuilder.group({
        nombre_usuario: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        clave: [''], // Opcional en edición, requerido en creación (validaremos luego)
        rol: ['invitado', Validators.required],
        activo: [true]
      });

      this.searchForm = this.formBuilder.group({
        campo: ['nombre_usuario', Validators.required],
        valor: ['', Validators.required]
      });

      this.getAllUsers();
    } else {
      this.router.navigate(['/login'])
    }
  }

  getAllUsers() {
    this.userService.getUsers(localStorage.getItem('accessToken')).subscribe(
      (data: User[]) => {
        this.userList = data;
        this.allUsers = data;
        console.log(data);
      },
      (error) => {
        console.error(error);
        this.toastr.error('Error al cargar usuarios', 'Error');
      }
    );
  }

  searchUsers() {
    if (this.searchForm.invalid) {
      this.toastr.warning('Por favor ingresa un valor para buscar', 'Advertencia');
      return;
    }
    const { campo, valor } = this.searchForm.value;
    const valorBusqueda = valor.toLowerCase();

    this.userList = this.allUsers.filter(user => {
      const valorCampo = (user as any)[campo];
      if (typeof valorCampo === 'string') {
        return valorCampo.toLowerCase().includes(valorBusqueda);
      }
      return false;
    });

    if (this.userList.length === 0) {
      this.toastr.info('No se encontraron usuarios con ese criterio', 'Información');
    }
  }

  clearSearch() {
    this.searchForm.reset({ campo: 'nombre_usuario', valor: '' });
    this.userList = [...this.allUsers];
  }

  newUserEntry() {
    if (this.userForm.invalid) {
      this.toastr.error('Por favor completa todos los campos requeridos', 'Error');
      return;
    }

    // Validar clave para nuevo usuario
    if (!this.userForm.value.clave) {
      this.toastr.error('La contraseña es obligatoria para nuevos usuarios', 'Error');
      return;
    }

    this.userService.newUser(localStorage.getItem('accessToken'), this.userForm.value).subscribe(
      () => {
        this.getAllUsers();
        this.userForm.reset({ rol: 'invitado', activo: true });
        this.toastr.success('Usuario creado exitosamente', 'Éxito');
      },
      (error) => {
        console.error(error);
        this.toastr.error('Error al crear usuario', 'Error');
      }
    );
  }

  toggleEditUser(id: any) {
    this.idUser = id;
    this.userService.getOneUser(localStorage.getItem('accessToken'), id).subscribe(
      (data) => {
        this.userForm.setValue({
          nombre_usuario: data.nombre_usuario,
          email: data.email,
          clave: '', // No mostramos la clave
          rol: data.rol,
          activo: data.activo
        });
        this.editableUser = true;
      },
      (error) => {
        console.error(error);
        this.toastr.error('Error al obtener usuario', 'Error');
      }
    );
  }

  updateUserEntry() {
    if (this.userForm.invalid) {
      // Si es edición, la clave puede estar vacía (no se cambia)
      // Pero los otros campos deben ser válidos
      if (this.userForm.get('nombre_usuario')?.invalid || this.userForm.get('email')?.invalid || this.userForm.get('rol')?.invalid) {
         this.toastr.error('Por favor completa los campos requeridos', 'Error');
         return;
      }
    }

    const data = this.userForm.value;
    if (!data.clave) {
      delete data.clave; // Si está vacía, no la enviamos para no sobrescribirla con vacío
    }

    this.userService.updateUser(localStorage.getItem('accessToken'), this.idUser, data).subscribe(
      () => {
        this.getAllUsers();
        this.editableUser = false;
        this.userForm.reset({ rol: 'invitado', activo: true });
        this.toastr.success('Usuario actualizado exitosamente', 'Éxito');
      },
      (error) => {
        console.error(error);
        this.toastr.error('Error al actualizar usuario', 'Error');
      }
    );
  }

  deleteUserEntry(id: any) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.userService.deleteUser(localStorage.getItem('accessToken'), id).subscribe(
        () => {
          this.getAllUsers();
          this.toastr.success('Usuario eliminado exitosamente', 'Éxito');
        },
        (error) => {
          console.error(error);
          this.toastr.error('Error al eliminar usuario', 'Error');
        }
      );
    }
  }

  cancelEdit() {
    this.editableUser = false;
    this.userForm.reset({ rol: 'invitado', activo: true });
  }
}
