import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IniciarSesionComponent } from './pages/inicio/iniciar-sesion/iniciar-sesion.component';
import { ResetPasswordComponent } from './pages/inicio/reset-password/reset-password.component';
import { NewPasswordComponent } from './pages/inicio/new-password/new-password.component';
import { ToastrModule} from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule, MatInputModule, MatButtonModule, MatGridListModule, MatDialogModule,
  MatTableModule, MatPaginatorModule, MatPaginatorIntl, MatDatepickerModule, MatCheckboxModule,
  MatRadioModule, MatSelectModule, MatAutocompleteModule, MatNativeDateModule, MatMenuModule} from '@angular/material';
import { environment } from 'src/environments/environment';
import { UserComponent } from './pages/user/user/user.component';
import { UserProfileComponent } from './pages/user/user-profile/user-profile.component';
import { EditProfileComponent } from './pages/user/edit-profile/edit-profile.component';
import { SegurosListComponent } from './pages/administrador/seguros/seguros-list/seguros-list.component';
import { NewSeguroComponent } from './pages/administrador/seguros/new-seguro/new-seguro.component';
import { EditSeguroComponent } from './pages/administrador/seguros/edit-seguro/edit-seguro.component';
import { EspecialidadesListComponent } from './pages/administrador/especialidades/especialidades-list/especialidades-list.component';
import { EditEspecialidadComponent } from './pages/administrador/especialidades/edit-especialidad/edit-especialidad.component';
import { NewEspecialidadComponent } from './pages/administrador/especialidades/new-especialidad/new-especialidad.component';
import { OdontologosListComponent } from './pages/administrador/odontologos/odontologos-list/odontologos-list.component';
import { NewOdontologoComponent } from './pages/administrador/odontologos/new-odontologo/new-odontologo.component';
import { EditOdontologoComponent } from './pages/administrador/odontologos/edit-odontologo/edit-odontologo.component';
import { ReportesComponent } from './pages/administrador/reportes/reportes.component';
import { PagosListComponent } from './pages/secretaria/pagos/pagos-list/pagos-list.component';
import { EditPagoComponent } from './pages/secretaria/pagos/edit-pago/edit-pago.component';
import { NewPagoComponent } from './pages/secretaria/pagos/new-pago/new-pago.component';
import { PacientesListComponent } from './pages/secretaria/pacientes/pacientes-list/pacientes-list.component';
import { EditPacienteComponent } from './pages/secretaria/pacientes/edit-paciente/edit-paciente.component';
import { NewPacienteComponent } from './pages/secretaria/pacientes/new-paciente/new-paciente.component';
import { CitasListComponent } from './pages/secretaria/citasMedicas/citas-list/citas-list.component';
import { EditCitaComponent } from './pages/secretaria/citasMedicas/edit-cita/edit-cita.component';
import { NewCitaComponent } from './pages/secretaria/citasMedicas/new-cita/new-cita.component';
import { SolicitudesListComponent } from './pages/secretaria/solicitudes/solicitudes-list/solicitudes-list.component';
import { PaginatorEspañol } from './paginator-español';
import { ValidarPerfilComponent } from './pages/inicio/validar-perfil/validar-perfil.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CitasListNowComponent } from './pages/secretaria/citasMedicas/citas-list-now/citas-list-now.component';
import { TratamientosListComponent } from './pages/secretaria/tratamientos/tratamientos-list/tratamientos-list.component';
import { NewTratamientoComponent } from './pages/secretaria/tratamientos/new-tratamiento/new-tratamiento.component';
import { EditTratamientoComponent } from './pages/secretaria/tratamientos/edit-tratamiento/edit-tratamiento.component';
import { StringbeautyPipe } from './pipes/pipes/stringbeauty.pipe';
import { ViewSeguroComponent } from './pages/administrador/seguros/view-seguro/view-seguro.component';

@NgModule({
  declarations: [
    AppComponent,
    IniciarSesionComponent,
    ResetPasswordComponent,
    NewPasswordComponent,
    UserComponent,
    UserProfileComponent,
    EditProfileComponent,
    SegurosListComponent,
    NewSeguroComponent,
    EditSeguroComponent,
    EspecialidadesListComponent,
    EditEspecialidadComponent,
    NewEspecialidadComponent,
    OdontologosListComponent,
    NewOdontologoComponent,
    EditOdontologoComponent,
    ReportesComponent,
    PagosListComponent,
    EditPagoComponent,
    NewPagoComponent,
    PacientesListComponent,
    EditPacienteComponent,
    NewPacienteComponent,
    CitasListComponent,
    EditCitaComponent,
    NewCitaComponent,
    SolicitudesListComponent,
    ValidarPerfilComponent,
    CitasListNowComponent,
    TratamientosListComponent,
    NewTratamientoComponent,
    EditTratamientoComponent,
    StringbeautyPipe,
    ViewSeguroComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatMenuModule,
    MatProgressSpinnerModule,
  ],
  entryComponents: [
    EditProfileComponent,
    NewEspecialidadComponent,
    EditEspecialidadComponent,
    NewSeguroComponent,
    EditSeguroComponent,
    NewOdontologoComponent,
    EditOdontologoComponent,
    NewPacienteComponent,
    EditPacienteComponent,
    NewPagoComponent,
    EditPagoComponent,
    NewCitaComponent,
    EditCitaComponent,
    NewTratamientoComponent,
    EditTratamientoComponent,
    ViewSeguroComponent
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorEspañol}, MatDatepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
