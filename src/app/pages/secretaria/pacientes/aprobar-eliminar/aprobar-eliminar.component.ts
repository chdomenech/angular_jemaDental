import { Component, OnInit } from '@angular/core';
import { CitaService } from './../../../../services/cita/cita.service';
import { PacienteService } from './../../../../services/paciente/paciente.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CitaMInterface } from './../../../../models/cita-model';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-aprobar-eliminar',
  templateUrl: './aprobar-eliminar.component.html',
  styleUrls: ['./aprobar-eliminar.component.css']
})
export class AprobarEliminarComponent implements OnInit {

  citasFiltradas: CitaMInterface[];

  constructor(
    public router: Router,
    public authService: AuthService,
    private toastmsg: ToastrService,
    private citaMService: CitaService,
    private pacienteService: PacienteService,
    private dialogRef: MatDialogRef<AprobarEliminarComponent>) {
      dialogRef.disableClose = true;
    }

  ngOnInit() {
    this.citaMService.getAllCitas().subscribe(rest => {
      const cedula = this.pacienteService.pacienteSelectedBorrar.cedula;
      this.citasFiltradas = rest.filter(datosCitas=>datosCitas.cipaciente === cedula ); 
      if(this.citasFiltradas.length>0){    
        this.toastmsg.warning('El paciente tiene citas medicas registradas en el sistema\r\nsi elimina al paciente se eliminaran sus citas medicas también', 'MENSAJE');
      }
    }, error => {
      throw error;
    });
  }
 

  borrarPaciente(){
    this.citasFiltradas.forEach(datos=>{
      this.citaMService.deleteCitaM(datos);
    });
    this.pacienteService.deletePaciente(this.pacienteService.pacienteSelectedBorrar);
        this.toastmsg.success('Registro eliminado exitosamente', 'MENSAJE');
        this.dialogRef.close();
    }

  close(): void {
    this.dialogRef.close();
  } 
}
