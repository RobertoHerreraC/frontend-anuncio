import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'publicaciones',
  },
  {
    path: 'publicaciones',
    loadComponent: () =>
      import('./features/publicaciones/publicaciones').then(
        (m) => m.PublicacionesComponent,
      ),
  },
  {
    path: 'categorias',
    loadComponent: () =>
      import('./features/categorias/categorias').then(
        (m) => m.CategoriasComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'publicaciones',
  },
];
