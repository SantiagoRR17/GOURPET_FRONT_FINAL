export interface User {
    _id?: string;
    nombre_usuario: string;
    email: string;
    clave?: string;
    rol: 'invitado' | 'dueño' | 'administrador';
    activo: boolean;
    fecha_registro?: Date;
}