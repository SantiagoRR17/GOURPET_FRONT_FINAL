export interface Jwtres {
  accessToken: string;
  datosUsuario?: {
    id: number,
    nombre_usuario: string,
    email: string,
    clave: string,
    rol: string,
    fecha_registro: Date,
    activo: boolean,
    expiresIn: string
  }
}