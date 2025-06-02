import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/categories', 
    pathMatch: 'full' 
  },
  { 
    path: 'categories', 
    loadComponent: () => import('./features/category-list/category-list.component')
      .then(c => c.CategoryListComponent) 
  },
  { 
    path: 'categories/new', 
    loadComponent: () => import('./features/category-form/category-form.component')
      .then(c => c.CategoryFormComponent) 
  },
  { 
    path: 'categories/:id', 
    loadComponent: () => import('./features/category-detail/category-detail.component')
      .then(c => c.CategoryDetailComponent) 
  },
  { 
    path: 'categories/:id/edit', 
    loadComponent: () => import('./features/category-form/category-form.component')
      .then(c => c.CategoryFormComponent) 
  },
  { 
    path: 'contacts', 
    loadComponent: () => import('./features/contact-list/contact-list.component')
      .then(c => c.ContactListComponent) 
  },
  { 
    path: 'contacts/new', 
    loadComponent: () => import('./features/contact-form/contact-form.component')
      .then(c => c.ContactFormComponent) 
  },
  { 
    path: 'contacts/:id/edit', 
    loadComponent: () => import('./features/contact-form/contact-form.component')
      .then(c => c.ContactFormComponent) 
  },
  { 
    path: '**', 
    redirectTo: '/categories' 
  }
];