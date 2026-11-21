import { Categoria } from './categoria.model';

export type EstadoPublicacion = 'activa' | 'pausada' | 'vendida';

export const ESTADOS_PUBLICACION: EstadoPublicacion[] = [
  'activa',
  'pausada',
  'vendida',
];

export interface Publicacion {
  id: number;
  titulo: string;
  descripcion: string | null;
  precio: number;
  categoriaId: number;
  estado: EstadoPublicacion;
  categoria?: Categoria | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PublicacionPayload {
  titulo: string;
  descripcion?: string | null;
  precio: number;
  categoriaId: number;
  estado?: EstadoPublicacion;
}

export interface PublicacionFiltros {
  categoriaId?: number;
  estado?: EstadoPublicacion;
}

export interface PublicacionListResponse {
  total: number;
  data: Publicacion[];
}

export interface PublicacionResponse {
  mensaje?: string;
  data: Publicacion;
}
