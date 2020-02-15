import { PagosListComponent } from './pages/secretaria/pagos/pagos-list/pagos-list.component';
import { SolicitudesListComponent } from './pages/secretaria/solicitudes/solicitudes-list/solicitudes-list.component';
import { PacientesListComponent } from './pages/secretaria/pacientes/pacientes-list/pacientes-list.component';
import { OdontologosListComponent } from './pages/administrador/odontologos/odontologos-list/odontologos-list.component';
import { SegurosListComponent } from './pages/administrador/seguros/seguros-list/seguros-list.component';
import { UserProfileComponent } from './pages/user/user-profile/user-profile.component';
import { UserComponent } from './pages/user/user/user.component';
import { NewPasswordComponent } from './pages/inicio/new-password/new-password.component';
import { ResetPasswordComponent } from './pages/inicio/reset-password/reset-password.component';
import { IniciarSesionComponent } from './pages/inicio/iniciar-sesion/iniciar-sesion.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EspecialidadesListComponent } from './pages/administrador/especialidades/especialidades-list/especialidades-list.component';
import { CitasListComponent } from './pages/secretaria/citasMedicas/citas-list/citas-list.component';
import { ReportesComponent } from './pages/administrador/reportes/reportes.component';
import { ValidarPerfilComponent } from './pages/inicio/validar-perfil/validar-perfil.component';


const routes: Routes = [
  {
    path: 'inicioSesion',
    component: IniciarSesionComponent
  },
  {
    path: 'restablecerPass',
    component: ResetPasswordComponent
  },
  {
    path: 'newPass',
    component: NewPasswordComponent
  },
  {
    path: 'inicio',
    component: UserComponent
  },
  {
    path: 'perfil',
    component: ValidarPerfilComponent
  },
  {
    path: 'especialidades',
    component: ValidarPerfilComponent
  },
  {
    path: 'seguros',
    component: ValidarPerfilComponent
  },
  {
    path: 'odontologos',
    component: ValidarPerfilComponent
  },
  {
    path: 'reportes',
    component: ValidarPerfilComponent
  },
  {
    path: 'pacientes',
    component: ValidarPerfilComponent
  },
  {
    path: 'citas',
    component: ValidarPerfilComponent
  },
  {
    path: 'pagos',
    component: ValidarPerfilComponent
  },
  {
    path: 'solicitudes',
    component: ValidarPerfilComponent
  },
  {
    path: '**',
    redirectTo: 'inicioSesion'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
