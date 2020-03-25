import { Component, OnInit } from '@angular/core';
import { TratamientoService } from './../../../../services/tratamiento/tratamiento.service';
import { PagoService } from './../../../../services/pago/pago.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PagosInterface } from './../../../../models/pago-model';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-aprobar-eliminar-tratamiento',
  templateUrl: './aprobar-eliminar-tratamiento.component.html',
  styleUrls: ['./aprobar-eliminar-tratamiento.component.css']
})
export class AprobarEliminarTratamientoComponent implements OnInit {

  pagoFiltrados: PagosInterface[];

constructor(
  public router: Router,
  public authService: AuthService,
  private toastmsg: ToastrService, 
  private tratamientoService: TratamientoService,
  private pagoService: PagoService,
  private dialogRef: MatDialogRef<AprobarEliminarTratamientoComponent>) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.pagoService.getAllPagos().subscribe(rest => {
      const cedula = this.tratamientoService.selectTratamientoBorrar.cipaciente;
      const tratamiento = this.tratamientoService.selectTratamientoBorrar.tratamiento;
      this.pagoFiltrados = rest.filter(datosPagos=>datosPagos.cedulaPaciente === cedula && datosPagos.tratamiento === tratamiento); 
      if(this.pagoFiltrados.length>0){    
        this.toastmsg.warning('El Tratamiento tiene pagos registrados en el sistema\r\nsi elimina el tratamiento se eliminarán los pagos también', 'MENSAJE');
      }
    }, error => {
      throw error;
    });
  }

  borrarTratamiento(){
    this.pagoFiltrados.forEach(datos=>{
      this.pagoService.deletePago(datos);
    });
    this.tratamientoService.deleteTratamientoM(this.tratamientoService.selectTratamientoBorrar);
        this.toastmsg.success('Registro eliminado exitosamente', 'MENSAJE');
        this.dialogRef.close();
    }
  
    close(): void {
      this.dialogRef.close();
    } 
  }