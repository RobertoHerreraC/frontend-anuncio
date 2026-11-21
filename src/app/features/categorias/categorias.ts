import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { mensajeError } from '../../core/http-error';
import { Categoria, CategoriaPayload } from '../../core/models/categoria.model';
import { CategoriaService } from '../../core/services/categoria.service';

@Component({
  selector: 'app-categorias',
  imports: [FormsModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.scss',
})
export class CategoriasComponent implements OnInit {
  private readonly categoriaService = inject(CategoriaService);

  readonly categorias = signal<Categoria[]>([]);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);
  readonly aviso = signal<string | null>(null);
  readonly editandoId = signal<number | null>(null);

  formulario: CategoriaPayload = this.formularioVacio();

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.categoriaService.listar().subscribe({
      next: (res) => {
        this.categorias.set(res.data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(mensajeError(err));
        this.cargando.set(false);
      },
    });
  }

  guardar(): void {
    const nombre = (this.formulario.nombre ?? '').trim();

    if (!nombre) {
      this.error.set('El nombre es obligatorio');
      return;
    }

    const payload: CategoriaPayload = {
      nombre,
      descripcion: (this.formulario.descripcion ?? '').trim(),
    };

    this.guardando.set(true);
    this.error.set(null);
    this.aviso.set(null);

    const id = this.editandoId();
    const peticion =
      id === null
        ? this.categoriaService.crear(payload)
        : this.categoriaService.actualizar(id, payload);

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

  editar(categoria: Categoria): void {
    this.editandoId.set(categoria.id);
    this.formulario = {
      nombre: categoria.nombre,
      descripcion: categoria.descripcion ?? '',
    };
    this.error.set(null);
    this.aviso.set(null);
  }

  cancelar(): void {
    this.editandoId.set(null);
    this.formulario = this.formularioVacio();
  }

  eliminar(categoria: Categoria): void {
    const confirmado = window.confirm(
      `¿Eliminar la categoría "${categoria.nombre}"?`,
    );

    if (!confirmado) {
      return;
    }

    this.error.set(null);
    this.aviso.set(null);

    this.categoriaService.eliminar(categoria.id).subscribe({
      next: (res) => {
        this.aviso.set(res.mensaje ?? 'Categoría eliminada correctamente');

        if (this.editandoId() === categoria.id) {
          this.cancelar();
        }

        this.listar();
      },
      error: (err) => this.error.set(mensajeError(err)),
    });
  }

  private formularioVacio(): CategoriaPayload {
    return { nombre: '', descripcion: '' };
  }
}
