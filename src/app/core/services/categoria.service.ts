import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Categoria,
  CategoriaListResponse,
  CategoriaPayload,
  CategoriaResponse,
} from '../models/categoria.model';

const API_URL = '/api/categorias';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly http = inject(HttpClient);

  listar(): Observable<CategoriaListResponse> {
    return this.http.get<CategoriaListResponse>(API_URL);
  }

  obtener(id: number): Observable<CategoriaResponse> {
    return this.http.get<CategoriaResponse>(`${API_URL}/${id}`);
  }

  crear(payload: CategoriaPayload): Observable<CategoriaResponse> {
    return this.http.post<CategoriaResponse>(API_URL, payload);
  }

  actualizar(
    id: number,
    payload: Partial<CategoriaPayload>,
  ): Observable<CategoriaResponse> {
    return this.http.put<CategoriaResponse>(`${API_URL}/${id}`, payload);
  }

  eliminar(id: number): Observable<CategoriaResponse> {
    return this.http.delete<CategoriaResponse>(`${API_URL}/${id}`);
  }
}
