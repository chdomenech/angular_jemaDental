import { map } from 'rxjs/operators';
import { PacienteInterface } from './../../../../models/paciente-model';
import { EditPacienteComponent } from './../edit-paciente/edit-paciente.component';
import { PacienteService } from './../../../../services/paciente/paciente.service';
import { OdontologoService } from './../../../../services/odontologo/odontologo.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SeguroService } from 'src/app/services/seguro/seguro.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-new-paciente',
  templateUrl: './new-paciente.component.html',
  styleUrls: ['./new-paciente.component.css']
})
export class NewPacienteComponent implements OnInit {

  allowedChars = new Set('0123456789'.split('').map(c => c.charCodeAt(0)));
  // tslint:disable-next-line: max-line-length
  imageUrl: any = 'https://firebasestorage.googleapis.com/v0/b/jema-dental.appspot.com/o/imageOdontProfile%2Fuserphoto.png?alt=media&token=79e54081-7486-41ec-b380-e3ff34def585';

  // tslint:disable-next-line: max-line-length
  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/;

  pacienteForm = new FormGroup({
    id: new FormControl(null),
    seguro: new FormControl('', Validators.required),
    nombre: new FormControl('', Validators.required),
    hClinica: new FormControl(''),
    cedula: new FormControl('', [Validators.required, Validators.minLength(10)]),
    telefono: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
    foto: new FormControl(''),
    rol: new FormGroup({
      paciente: new FormControl(true)
    })
  });

  constructor(
    private toastr: ToastrService,
    public segService: SeguroService,
    public pacientService: PacienteService,
    public odontoService: OdontologoService,
    private dialogRef: MatDialogRef<EditPacienteComponent>,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {

  }

  validateCedula(){
    const cedula = this.pacienteForm.get('cedula').value;
    const existeCedOdont = this.odontoService.arrayOdontologos.find(data=>data.cedula===cedula);
    const existeCedPacient =  this.pacientService.arrayPacientes.find(paciente => paciente.cedula === cedula);
    
    if(existeCedOdont){
      this.pacienteForm.get('cedula').setErrors({repeatOdonto:true})
      this.toastr.warning('La cedula escrita pertenece a un odontologo', 'MENSAJE');
    }else if(existeCedPacient){
      this.pacienteForm.get('cedula').setErrors({repeatCedPaciente:true})
      this.toastr.warning('La cedula escrita pertenece a un paciente', 'MENSAJE');
    }    
  }

  savePaciente(data: PacienteInterface) {
    data.foto = this.imageUrl;
    data.rol.paciente = true;
    data.email = data.email.toLowerCase();
    const pacientFilteredC = this.pacientService.arrayPacientes.find(
      pacientFilterbycedula => pacientFilterbycedula.cedula === data.cedula);
    const pacientFilteredE = this.pacientService.arrayPacientes.find(
      pacientFilterbyemail => pacientFilterbyemail.email === data.email);
    const pacientFilteredHC = this.pacientService.arrayPacientes.find(
      pacientFilterbyHC => pacientFilterbyHC.hClinica === data.hClinica);

    this.validateCedula();  

    if (pacientFilteredC === undefined) {
      if (pacientFilteredE === undefined) {
        if ((pacientFilteredHC === undefined) || (data.hClinica === '')) {
          this.pacientService.addPaciente(data);
          this.toastr.success('Registro guardado exitosamente', 'MENSAJE');
          this.close();
        } else {
          this.toastr.warning('El número de historia clínica ya existe', 'MENSAJE');
        }
      } else {
        this.toastr.warning('El email ya se encuentra registrado', 'MENSAJE');
      }
    } else {
      this.toastr.warning('El número de cédula ya se encuentra registrado', 'MENSAJE');
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  check(event: KeyboardEvent) {
    if (event.keyCode > 31 && !this.allowedChars.has(event.keyCode)) {
      event.preventDefault();
    }     
  }

  getErrorMessageE() {
    return this.pacienteForm.get('email').hasError('pattern') ? 'Correo electrónico invalido' :
           this.pacienteForm.get('email').hasError('required') ? 'Campo obligatorio' :
            '';
  }

  getErrorMessageN() {
    return  this.pacienteForm.get('nombre').hasError('required') ? 'Campo obligatorio' : '';
  }
  getErrorMessageC() {
    return  this.pacienteForm.get('cedula').hasError('required') ? 'Campo obligatorio' :
            this.pacienteForm.get('cedula').hasError('minlength') ? 'La cédula debe tener 10 digitos' :
            this.pacienteForm.get('cedula').hasError('repeatOdonto') ? 'La cédula escrita pertenece a un odontologo' :
            this.pacienteForm.get('cedula').hasError('repeatCedPaciente') ? 'La cédula escrita pertenece a un paciente' :
    '';
  }

}
