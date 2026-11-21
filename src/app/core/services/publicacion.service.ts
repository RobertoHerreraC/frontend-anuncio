import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  PublicacionFiltros,
  PublicacionListResponse,
  PublicacionPayload,
  PublicacionResponse,
} from '../models/publicacion.model';

const API_URL = '/api/publicaciones';

@Injectable({ providedIn: 'root' })
export class PublicacionService {
  private readonly http = inject(HttpClient);

  listar(filtros?: PublicacionFiltros): Observable<PublicacionListResponse> {
    let params = new HttpParams();

    if (filtros?.categoriaId !== undefined) {
      params = params.set('categoriaId', filtros.categoriaId);
    }

    if (filtros?.estado) {
      params = params.set('estado', filtros.estado);
    }

    return this.http.get<PublicacionListResponse>(API_URL, { params });
  }

  obtener(id: number): Observable<PublicacionResponse> {
    return this.http.get<PublicacionResponse>(`${API_URL}/${id}`);
  }

  crear(payload: PublicacionPayload): Observable<PublicacionResponse> {
    return this.http.post<PublicacionResponse>(API_URL, payload);
  }

  actualizar(
    id: number,
    payload: Partial<PublicacionPayload>,
  ): Observable<PublicacionResponse> {
    return this.http.put<PublicacionResponse>(`${API_URL}/${id}`, payload);
  }

  eliminar(id: number): Observable<PublicacionResponse> {
    return this.http.delete<PublicacionResponse>(`${API_URL}/${id}`);
  }
}
