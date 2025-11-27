import { Routes } from '@angular/router';

import { Register } from './components/register/register';
import { Homei } from './components/homei/homei';
import { Login } from './components/authentication/login/login';
import { Animal } from './components/base/animal/animal';
import { Users } from './components/base/users/users';
import { Logout } from './components/authentication/logout/logout';
import { Recetas } from './components/base/recetas/recetas';
import { FavoritosListComponent } from './components/favoritos/list/favoritoslist.component';
import { CalificarComponent } from './components/calificaciones/calificar.component';

export const routes: Routes = [
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: '', component: Homei, pathMatch: 'full'},
    {path: 'animal', component: Animal},
    {path: 'users', component: Users},
    {path: 'logout', component: Logout},
    {path: 'recetas', component: Recetas},
    {path: 'favoritos', component: FavoritosListComponent },
    { path: 'calificar', component: CalificarComponent },


];
