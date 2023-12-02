import { Routes } from '@angular/router';
import { ProductComponent } from './pages/product/product.component';
import { FormComponent } from './pages/form/form.component';

export const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
  },
  {
    path: 'form',
    component: FormComponent,
  },
];
