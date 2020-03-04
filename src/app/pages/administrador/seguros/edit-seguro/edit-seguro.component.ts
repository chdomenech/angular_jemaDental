import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SeguroService } from 'src/app/services/seguro/seguro.service';
import { MatDialogRef } from '@angular/material';
import { SeguroInteface } from 'src/app/models/seguro-model';
import { EspecialidadService } from './../../../../services/especialidad/especialidad.service';

@Component({
  selector: 'app-edit-seguro',
  templateUrl: './edit-seguro.component.html',
  styleUrls: ['./edit-seguro.component.css']
})
export class EditSeguroComponent implements OnInit {

  seguroForm = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl('', Validators.required),
    email:new FormControl('', [Validators.required, Validators.email]),
    especialidades:new FormControl('', Validators.required),
    direccion:new FormControl(''),
    telefono:new FormControl(''),    
  });
  specialtiesSelected:  string[];
  allowedChars = new Set('0123456789'.split('').map(c => c.charCodeAt(0)));

  constructor(
    private toastr: ToastrService,
    public espeService: EspecialidadService,
    public seguroService: SeguroService,
    private dialogRef: MatDialogRef<EditSeguroComponent>
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {

    console.log("this.seguroService.seguroSelected -> ",this.seguroService.seguroSelected);

    this.seguroForm.get('id').setValue(this.seguroService.seguroSelected.id);
    this.seguroForm.get('nombre').setValue(this.seguroService.seguroSelected.nombre);
    this.seguroForm.get('direccion').setValue(this.seguroService.seguroSelected.direccion);
    this.seguroForm.get('especialidades').setValue(this.seguroService.seguroSelected.especialidades);
    this.seguroForm.get('telefono').setValue(this.seguroService.seguroSelected.telefono);
    this.seguroForm.get('email').setValue(this.seguroService.seguroSelected.email);
  }

  onSaveSeguro(data: SeguroInteface) {
    data.nombre = data.nombre.toLowerCase();
    const seguroFiltered = this.seguroService.arraySeguros.find(espeFilterbynombre => espeFilterbynombre.nombre === data.nombre);

    if (this.existEmail(data.email, data.nombre)===true){
      this.toastr.warning('El email ya se encuentra registrado', 'MENSAJE');
    }else if (((this.seguroService.seguroSelected.nombre === data.nombre) && seguroFiltered) || seguroFiltered === undefined) {
      this.seguroService.updateSeguro(data);
      this.toastr.success('Registro actualizado exitosamente', 'MENSAJE');
      this.close();
    } else {
      this.toastr.warning('El seguro ya se encuentra registrado', 'MENSAJE');
    }

  }

  existEmail(email: any, nombre: any): boolean {
    let exist = false;
    if (email) {
      const emailFiltered = this.seguroService.
      arraySeguros.find(seguro => seguro.email.toLowerCase() === email.toLowerCase()
      && seguro.nombre.toLowerCase() !== nombre.toLowerCase());
      if (emailFiltered) {
        exist = true;
      } else {
        exist = false;
      }
    } else {
      exist = false;
    }
    return exist;
  }

  check(event: KeyboardEvent) {
    if (event.keyCode > 31 && !this.allowedChars.has(event.keyCode)) {
      event.preventDefault();
    }
  }

   especialidad(val: any) {
    console.log(val);
    this.specialtiesSelected = val;
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
