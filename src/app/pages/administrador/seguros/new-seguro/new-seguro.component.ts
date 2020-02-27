import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SeguroService } from 'src/app/services/seguro/seguro.service';
import { MatDialogRef } from '@angular/material';
import { SeguroInteface } from 'src/app/models/seguro-model';
import { EspecialidadService } from './../../../../services/especialidad/especialidad.service';

@Component({
  selector: 'app-new-seguro',
  templateUrl: './new-seguro.component.html',
  styleUrls: ['./new-seguro.component.css']
})
export class NewSeguroComponent implements OnInit {

  seguroForm = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl('', Validators.required),
    direccion:new FormControl(''),
    telefono:new FormControl(''),
    email:new FormControl('', [Validators.required, Validators.email]),
    especialidades:new FormControl('', Validators.required),
  });

  specialtiesSelected:  string[];

  constructor(
    public espeService: EspecialidadService,
    private toastr: ToastrService,
    public seguroService: SeguroService,
    private dialogRef: MatDialogRef<NewSeguroComponent>
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
  }

  onSaveSeguro(data: SeguroInteface) {

    data.nombre = data.nombre.toLowerCase();
    data.especialidades = this.specialtiesSelected;
    if (this.existSeguro(data.nombre) === true) {
      this.toastr.warning('El seguro ya se encuentra registrado', 'MENSAJE');
    } else {
      this.seguroService.addSeguro(data);
      this.toastr.success('Registro actualizado exitosamente', 'MENSAJE');
      this.close();
    }
  }

  especialidad(val: any) {
    console.log(val);
    this.specialtiesSelected = val;
  }
  existSeguro(nombre: any): boolean {
    let exist = false;
    if (nombre) {
      const seguroFiltered = this.seguroService.arraySeguros.find(espeFilterbynombre => espeFilterbynombre.nombre === nombre);
      if (seguroFiltered) {
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
    return  this.seguroForm.get('nombre').hasError('required') ? 'Campo obligatorio' : '';
  }

  msgValidateEspecialidad() {
    return  this.seguroForm.get('especialidades').hasError('required') ? 'Campo obligatorio' : '';
  }

  msgValidateEmail() {
    return  this.seguroForm.get('email').hasError('required') ? 'Campo obligatorio' : '';
  }

}
