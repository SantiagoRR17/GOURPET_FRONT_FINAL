export interface User {
  user: {
    id: number,
    nombre_usuario: string,
    email: string,
    clave: string,
    rol: string,
    fecha_registro: Date,
    activo: boolean
  }

}