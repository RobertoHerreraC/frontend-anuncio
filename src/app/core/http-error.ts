import { HttpErrorResponse } from '@angular/common/http';

export function mensajeError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const mensaje = error.error?.mensaje;

    if (typeof mensaje === 'string' && mensaje.trim() !== '') {
      return mensaje;
    }

    if (error.status === 0) {
      return 'No se pudo conectar con el backend. Verifica que la API esté en ejecución.';
    }

    return `Error ${error.status}: ${error.statusText || 'solicitud fallida'}`;
  }

  return 'Ocurrió un error inesperado.';
}
