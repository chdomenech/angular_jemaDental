import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SeguroService } from 'src/app/services/seguro/seguro.service';
import { MatDialogRef } from '@angular/material';
import { SeguroInteface } from 'src/app/models/seguro-model';
import { EspecialidadService } from './../../../../services/especialidad/especialidad.service';
import { OdontologoService } from './../../../../services/odontologo/odontologo.service';
import { PacienteService } from './../../../../services/paciente/paciente.service';


@Component({
  selector: 'app-new-seguro',
  templateUrl: './new-seguro.component.html',
  styleUrls: ['./new-seguro.component.css']
})
export class NewSeguroComponent implements OnInit {

  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/;

  seguroForm = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl('', Validators.required),
    direccion:new FormControl(''),
    telefono:new FormControl(''),
    email:new FormControl('', [Validators.required, Validators.email, Validators.pattern(this.emailPattern)]),
    sitioweb:new FormControl(''), 
  });
  

  allowedChars = new Set('0123456789'.split('').map(c => c.charCodeAt(0)));
  specialtiesSelected:  string[];

  constructor(
    public espeService: EspecialidadService,
    private toastr: ToastrService,
    public seguroService: SeguroService,
    public odonService: OdontologoService,
    public pacientService: PacienteService,
    private dialogRef: MatDialogRef<NewSeguroComponent>
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
  }

  onSaveSeguro(data: SeguroInteface) {
    data.nombre = data.nombre.toLowerCase();
    data.especialidades = this.specialtiesSelected;

    this.validateEmail();

    if(this.specialtiesSelected === undefined || this.specialtiesSelected.length ==0){
      this.toastr.warning('Debe seleccionar al menos una especialidad', 'MENSAJE');
    }else if (this.existSeguro(data.nombre) === true) {
      this.toastr.warning('El seguro ya se encuentra registrado', 'MENSAJE');
    }else {
      this.seguroService.addSeguro(data);
      this.toastr.success('Registro actualizado exitosamente', 'MENSAJE');
      this.close();
    }
  }

  validateEmail(){
    const email = this.seguroForm.get('email').value;
    const existeEmailOdont = this.odonService.arrayOdontologos.find(data=>data.email===email);
    const existeEmailPacient =  this.pacientService.arrayPacientes.find(paciente => paciente.email === email);
    const existeEmailSeguro =  this.seguroService.arraySeguros.find(seguro => seguro.email === email);
    console.log("email -> ",email);
    if(existeEmailOdont){
      this.seguroForm.get('email').setErrors({repeatEmailOdonto:true})
      this.toastr.warning('El email escrito pertenece a un odontologo', 'MENSAJE');
    }else if(existeEmailPacient){
      this.seguroForm.get('email').setErrors({repeatEmailPaciente:true})
      this.toastr.warning('El email escrito pertenece a un paciente', 'MENSAJE');
    }else if(existeEmailSeguro){
      this.seguroForm.get('email').setErrors({repeatEmailSeguro:true})
      this.toastr.warning('El email escrito pertenece a un seguro', 'MENSAJE');
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

  close(): void {
  this.dialogRef.close();
  }

  msgValidateNombre() {
    return  this.seguroForm.get('nombre').hasError('required') ? 'Campo obligatorio' : '';
  }

  msgValidateEmail() {
    return this.seguroForm.get('email').hasError('pattern') ? 'Correo electrónico invalido' :
    this.seguroForm.get('email').hasError('required') ? 'Campo Requerido' :
    this.seguroForm.get('email').hasError('repeatEmailOdonto') ? 'El email escrito pertenece a un odontologo' :
    this.seguroForm.get('email').hasError('repeatEmailPaciente') ? 'El email escrito pertenece a un paciente' :
    this.seguroForm.get('email').hasError('repeatEmailSeguro') ? 'El email escrito pertenece a un seguro' :
     '';
  }

  msgValidateEspecialidad() {
    return  this.seguroForm.get('especialidades').hasError('required') ? 'Campo obligatorio' : '';
  }

}
