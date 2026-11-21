export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoriaPayload {
  nombre: string;
  descripcion?: string | null;
}

export interface CategoriaListResponse {
  total: number;
  data: Categoria[];
}

export interface CategoriaResponse {
  mensaje?: string;
  data: Categoria;
}
