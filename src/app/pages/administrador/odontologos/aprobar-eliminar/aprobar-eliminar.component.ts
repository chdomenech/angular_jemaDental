import { Component, OnInit } from '@angular/core';
import { CitaService } from './../../../../services/cita/cita.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CitaMInterface } from './../../../../models/cita-model';
import { MatDialogRef } from '@angular/material';
import { OdontologoService } from './../../../../services/odontologo/odontologo.service';

@Component({
  selector: 'app-aprobar-eliminar',
  templateUrl: './aprobar-eliminar.component.html',
  styleUrls: ['./aprobar-eliminar.component.css']
})
export class AprobarEliminarOdontologoComponent implements OnInit {

  citasFiltradas: CitaMInterface[];
  mensajeOdont:any;
  
  constructor(
    public router: Router,
    public authService: AuthService,
    private toastmsg: ToastrService,
    private citaMService: CitaService,   
    private odontService: OdontologoService,
    private dialogRef: MatDialogRef<AprobarEliminarOdontologoComponent>) {
      dialogRef.disableClose = true;
    }

    ngOnInit() {
      this.citaMService.getAllCitas().subscribe(rest => {
        const cedula = this.odontService.odontologoSelectedBorrar.cedula;
        this.citasFiltradas = rest.filter(datosCitas=>datosCitas.odontologo === cedula ); 
        if(this.citasFiltradas.length>0){    
          this.mensajeOdont = 'El Odontologo tiene citas medicas registradas en el sistema \nsi elimina al odontologo se eliminarán sus citas medicas también';
        }
      }, error => {
        throw error;
      });
    }

    borrarOdontologo(){
      this.citasFiltradas.forEach(datos=>{
        this.citaMService.deleteCitaM(datos);
      });
      this.odontService.deleteOdontologo(this.odontService.odontologoSelectedBorrar);
          this.toastmsg.success('Registro eliminado exitosamente', 'MENSAJE');
          this.dialogRef.close();
      }
  
    close(): void {
      this.dialogRef.close();
    } 
  }
