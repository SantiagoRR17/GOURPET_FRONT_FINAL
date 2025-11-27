export interface Receta {
    _id?: string;
    nombre: string;
    descripcion: string;
    ingredientes: string; // Usaremos string para simplificar el input, el usuario puede escribir una lista
    tipo_dieta: 'vegana' | 'vegetariana' | 'convencional' | 'cruda';
    especie?: 'perro' | 'gato';
    calificacion_promedio?: number;
    publicada?: boolean;
    fecha_creacion?: Date;
    fecha_actualizacion?: Date;
    creada_por: string;
}
