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
    sitioweb:new FormControl(''), 
  });

  allowedChars = new Set('0123456789'.split('').map(c => c.charCodeAt(0)));
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

    if(this.specialtiesSelected === undefined || this.specialtiesSelected.length ==0){
      this.toastr.warning('Debe seleccionar al menos una especialidad', 'MENSAJE');
    }else if (this.existSeguro(data.nombre) === true) {
      this.toastr.warning('El seguro ya se encuentra registrado', 'MENSAJE');
    }else if (this.existEmail(data.email)===true){
      this.toastr.warning('El email ya se encuentra registrado', 'MENSAJE');
    }else {
      this.seguroService.addSeguro(data);
      this.toastr.success('Registro actualizado exitosamente', 'MENSAJE');
      this.close();
    }
  }

  checkEspecialidad(val: any){
    if(this.specialtiesSelected === undefined){
      this.specialtiesSelected =[];
    }
    if(val.checked){
      this.specialtiesSelected.push(val.source.value);
    }else{
      this.specialtiesSelected = this.specialtiesSelected.filter(data =>data !=val.source.value);
    }    
    
  }

  check(event: KeyboardEvent) {
    if (event.keyCode > 31 && !this.allowedChars.has(event.keyCode)) {
      event.preventDefault();
    }
  }

  especialidad(val: any) {
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

  existEmail(email: any): boolean {
    let exist = false;
    if (email) {
      const emailFiltered = this.seguroService.arraySeguros.find(seguro => seguro.email.toLowerCase() === email.toLowerCase());
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
