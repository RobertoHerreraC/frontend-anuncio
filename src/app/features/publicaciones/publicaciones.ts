import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { mensajeError } from '../../core/http-error';
import { Categoria } from '../../core/models/categoria.model';
import {
  ESTADOS_PUBLICACION,
  EstadoPublicacion,
  Publicacion,
  PublicacionFiltros,
  PublicacionPayload,
} from '../../core/models/publicacion.model';
import { CategoriaService } from '../../core/services/categoria.service';
import { PublicacionService } from '../../core/services/publicacion.service';

interface PublicacionForm {
  titulo: string;
  descripcion: string;
  precio: number | null;
  categoriaId: number | null;
  estado: EstadoPublicacion;
}

@Component({
  selector: 'app-publicaciones',
  imports: [FormsModule, DecimalPipe, RouterLink],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.scss',
})
export class PublicacionesComponent implements OnInit {
  private readonly publicacionService = inject(PublicacionService);
  private readonly categoriaService = inject(CategoriaService);

  readonly publicaciones = signal<Publicacion[]>([]);
  readonly categorias = signal<Categoria[]>([]);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);
  readonly aviso = signal<string | null>(null);
  readonly editandoId = signal<number | null>(null);

  readonly estados = ESTADOS_PUBLICACION;

  filtros: { categoriaId: string; estado: '' | EstadoPublicacion } = {
    categoriaId: '',
    estado: '',
  };

  formulario: PublicacionForm = this.formularioVacio();

  ngOnInit(): void {
    this.cargarCategorias();
    this.listar();
  }

  cargarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (res) => this.categorias.set(res.data),
      error: (err) => this.error.set(mensajeError(err)),
    });
  }

  listar(): void {
    const filtros: PublicacionFiltros = {};

    if (this.filtros.categoriaId !== '') {
      filtros.categoriaId = Number(this.filtros.categoriaId);
    }

    if (this.filtros.estado !== '') {
      filtros.estado = this.filtros.estado;
    }

    this.cargando.set(true);
    this.error.set(null);

    this.publicacionService.listar(filtros).subscribe({
      next: (res) => {
        this.publicaciones.set(res.data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(mensajeError(err));
        this.cargando.set(false);
      },
    });
  }

  limpiarFiltros(): void {
    this.filtros = { categoriaId: '', estado: '' };
    this.listar();
  }

  guardar(): void {
    const titulo = (this.formulario.titulo ?? '').trim();
    const precio = Number(this.formulario.precio);

    if (!titulo) {
      this.error.set('El título es obligatorio');
      return;
    }

    if (!Number.isFinite(precio) || precio < 0) {
      this.error.set('El precio debe ser un número mayor o igual a 0');
      return;
    }

    if (this.formulario.categoriaId === null) {
      this.error.set('Debe seleccionar una categoría');
      return;
    }

    const payload: PublicacionPayload = {
      titulo,
      descripcion: (this.formulario.descripcion ?? '').trim(),
      precio,
      categoriaId: this.formulario.categoriaId,
      estado: this.formulario.estado,
    };

    this.guardando.set(true);
    this.error.set(null);
    this.aviso.set(null);

    const id = this.editandoId();
    const peticion =
      id === null
        ? this.publicacionService.crear(payload)
        : this.publicacionService.actualizar(id, payload);

    peticion.subscribe({
      next: (res) => {
        this.aviso.set(res.mensaje ?? 'Operación realizada correctamente');
        this.guardando.set(false);
        this.cancelar();
        this.listar();
      },
      error: (err) => {
        this.error.set(mensajeError(err));
        this.guardando.set(false);
      },
    });
  }

  editar(publicacion: Publicacion): void {
    this.editandoId.set(publicacion.id);
    this.formulario = {
      titulo: publicacion.titulo,
      descripcion: publicacion.descripcion ?? '',
      precio: publicacion.precio,
      categoriaId: publicacion.categoriaId,
      estado: publicacion.estado,
    };
    this.error.set(null);
    this.aviso.set(null);
  }

  cancelar(): void {
    this.editandoId.set(null);
    this.formulario = this.formularioVacio();
  }

  eliminar(publicacion: Publicacion): void {
    const confirmado = window.confirm(
      `¿Eliminar la publicación "${publicacion.titulo}"?`,
    );

    if (!confirmado) {
      return;
    }

    this.error.set(null);
    this.aviso.set(null);

    this.publicacionService.eliminar(publicacion.id).subscribe({
      next: (res) => {
        this.aviso.set(res.mensaje ?? 'Publicación eliminada correctamente');

        if (this.editandoId() === publicacion.id) {
          this.cancelar();
        }

        this.listar();
      },
      error: (err) => this.error.set(mensajeError(err)),
    });
  }

  private formularioVacio(): PublicacionForm {
    return {
      titulo: '',
      descripcion: '',
      precio: null,
      categoriaId: null,
      estado: 'activa',
    };
  }
}
