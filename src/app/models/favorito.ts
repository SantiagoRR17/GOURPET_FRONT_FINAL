export interface Favorito {
  _id?: string;          
  usuario: any; // Puede ser string (ID) o objeto (Populated)
  receta: any;  // Puede ser string (ID) o objeto (Populated)
  fecha_agregado?: string;  
}
