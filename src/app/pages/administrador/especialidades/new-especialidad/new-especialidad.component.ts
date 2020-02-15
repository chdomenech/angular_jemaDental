import { EspecialidadInterface } from './../../../../models/especialidad-model';
import { EspecialidadService } from './../../../../services/especialidad/especialidad.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-new-especialidad',
  templateUrl: './new-especialidad.component.html',
  styleUrls: ['./new-especialidad.component.css']
})
export class NewEspecialidadComponent implements OnInit {

  subscription: Subscription;

  especialidadForm = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl('', Validators.required),
  });

  constructor(
    private toastr: ToastrService,
    public espeService: EspecialidadService,
    private dialogRef: MatDialogRef<NewEspecialidadComponent>
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
  }

  onSaveEspe(data: EspecialidadInterface) {
    data.nombre = data.nombre.toLowerCase();
    if (this.existEspecialidad(data.nombre) === true) {
      this.toastr.warning('La especialidad ya se encuentra registrada', 'MENSAJE');
    } else {
      this.espeService.addEspecialidad(data);
      this.toastr.success('Registro guardado exitosamente', 'MENSAJE');
      this.close();
    }
  }

  existEspecialidad(nombre: any): boolean {
    let exist = false;
    if (nombre) {
      const espeFiltered = this.espeService.arrayEspe.find(espeFilterbynombre => espeFilterbynombre.nombre === nombre);
      if (espeFiltered) {
        exist = true;
      } else {
        exist = false;
      }
    } else {
      exist = false;
    }
    return exist;
  }

  close(): void {
  this.dialogRef.close();
  }

  msgValidateNombre() {
    return  this.especialidadForm.get('nombre').hasError('required') ? 'Campo obligatorio' : '';
  }
}
