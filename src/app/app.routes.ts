import { Routes } from '@angular/router';
import { HomeComponent } from './features/client/pages/home/home.component';
import { ServicesComponent } from './features/client/pages/service/services.component';
import { ProductsComponent } from './features/client/pages/products/products.component';
import { ContactComponent } from './features/client/pages/contact/contact.component';
import { roleGuard } from './core/guards/role-guard.guard';
import { LoginComponent } from './features/client/pages/login/login.component';
import { RegisterComponent } from './features/client/pages/register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    children: [
      {
        path: 'client',
        canActivate: [roleGuard],
        data: { allowedRoles: ['CLIENTE'] },
        loadComponent: () => import('./features/client/pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
