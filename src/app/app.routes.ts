import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { authGuard } from './custom/auth.guard';

export const routes: Routes = [
    {path: '', component:LoginComponent},
    {path: 'registro', component:RegisterComponent},
    {path: 'inicio', component:InicioComponent, canActivate:[authGuard]},
];
