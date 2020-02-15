import { OdontologoInterface } from './../../../../models/odontologo-model';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { OdontologoService } from './../../../../services/odontologo/odontologo.service';
import { EspecialidadService } from './../../../../services/especialidad/especialidad.service';
import { Component, OnInit, ElementRef, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-odontologo',
  templateUrl: './new-odontologo.component.html',
  styleUrls: ['./new-odontologo.component.css']
})
export class NewOdontologoComponent implements OnInit {

  @ViewChildren('fileInput') el: ElementRef;
  // tslint:disable-next-line: max-line-length
  imageUrl: any = 'https://firebasestorage.googleapis.com/v0/b/jema-dental.appspot.com/o/imageOdontProfile%2Fuserphoto.png?alt=media&token=79e54081-7486-41ec-b380-e3ff34def585';
  // tslint:disable-next-line: max-line-length
  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/;

  allowedChars = new Set('0123456789'.split('').map(c => c.charCodeAt(0)));
  private image: any;

  Odonform = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl('', Validators.required),
    especialidad: new FormControl('', Validators.required),
    cedula: new FormControl('', [Validators.required, Validators.minLength(10)]),
    telefono: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
    foto: new FormControl(null),
    jornadaLaboral: new FormControl('', Validators.required),
    lunes: new FormControl(null),
    martes: new FormControl(null),
    miércoles: new FormControl(null),
    jueves: new FormControl(null),
    viernes: new FormControl(null),
    sábado: new FormControl(null),
  });

  odont: OdontologoInterface = {
    id : null,
    horario: '',
    foto: '',
    telefono: '',
    cedula: '',
    email: '',
    nombre: '',
    especialidad: '',
    jornadaLaboral: '',
    rol: {
      odontologo: true
    }
  };


  jornada: string[] = ['Matutina', 'Vespertina', 'Tiempo Completo'];
  horaInicioJ: string;
  horaFinJ: string;
  horas: any;

  constructor(
    private toastr: ToastrService,
    public espeService: EspecialidadService,
    public odonService: OdontologoService,
    private dialogRef: MatDialogRef<NewOdontologoComponent>
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.dialogRef.updateSize('60%', '100%');
    this.image = this.imageUrl;
  }

  uploadFile(event: any) {
    const reader = new FileReader(); // HTML5 FileReader API
    this.image = event.target.files[0];
    reader.readAsDataURL(this.image);
    reader.onload = () => {
        this.imageUrl = reader.result;
    };
  }

  saveOdontologo() {
    if (!this.Odonform.get('lunes').value && !this.Odonform.get('martes').value &&
       !this.Odonform.get('miércoles').value && !this.Odonform.get('jueves').value &&
       !this.Odonform.get('viernes').value && !this.Odonform.get('sábado').value) {
        this.toastr.warning('Seleccione los dias de trabajo del Odontólogo', 'MENSAJE');
    } else {
      this.getInfoOdontologo();
      this.odont.email = this.odont.email.toLowerCase();
      const odontFilteredC = this.odonService.arrayOdontologos.find(
        odontFilterbycedula => odontFilterbycedula.cedula === this.odont.cedula);
      const odontFilteredE = this.odonService.arrayOdontologos.find(odontFilterbyemail => odontFilterbyemail.email === this.odont.email);
      if (odontFilteredC === undefined) {
        if (odontFilteredE === undefined) {
          if (this.image === this.imageUrl) {
            this.odonService.addNewOdontologo(this.odont);
          } else {
            this.odonService.addNewOdontologo(this.odont , this.image);
          }
          this.toastr.success('Registro guardado exitosamente', 'MENSAJE');
          this.close();
        } else {
          this.toastr.warning('El email ya se encuentra registrado', 'MENSAJE');
        }
      } else {
        this.toastr.warning('El número de cédula ya se encuentra registrado', 'MENSAJE');
      }
    }
  }

  getInfoOdontologo() {
    this.odont.cedula = this.Odonform.get('cedula').value;
    this.odont.nombre = this.Odonform.get('nombre').value;
    this.odont.email = this.Odonform.get('email').value;
    this.odont.especialidad = this.Odonform.get('especialidad').value;
    this.odont.foto = this.Odonform.get('foto').value;
    this.odont.telefono = this.Odonform.get('telefono').value;
    this.odont.jornadaLaboral = this.Odonform.get('jornadaLaboral').value;
    this.odont.foto = this.image;
    this.horario(this.odont.jornadaLaboral);
  }

  horario( jornada) {
    const lista = [];

    if (jornada === 'Matutina') {
      this.horaInicioJ = '08:00';
      this.horaFinJ = '13:00';
      this.horas = ['08:00', '08:20', '08:40', '09:00',
                    '09:20', '09:40', '10:00', '10:20',
                    '10:40', '11:00', '11:20', '11:40',
                    '12:00', '12:20', '12:40', '13:00'];
    }
    if (jornada === 'Vespertina') {
      this.horaInicioJ = '13:00';
      this.horaFinJ = '18:00';
      this.horas = ['13:00', '13:20', '13:40', '14:00',
                    '14:20', '14:40', '15:00', '15:20',
                    '15:40', '16:00', '16:20', '16:40',
                    '17:00', '17:20', '17:40', '18:00'];

    }
    if (jornada === 'Tiempo Completo') {
      this.horaInicioJ = '08:00';
      this.horaFinJ = '18:00';
      this.horas = ['08:00', '08:20', '08:40', '09:00',
                    '09:20', '09:40', '10:00', '10:20',
                    '10:40', '11:00', '11:20', '11:40',
                    '12:00', '12:20', '12:40', '13:00',
                    '14:00', '14:20', '14:40', '15:00',
                    '15:20', '15:40', '16:00', '16:20',
                    '16:40', '17:00', '17:20', '17:40',
                    '18:00'];

    }
    if (this.Odonform.get('lunes').value) {
       const lunes = {
        dia: 'lunes',
        horaInicio: this.horaInicioJ,
        horaFin: this.horaFinJ,
        horas: this.horas,
      };
       lista.push(lunes);
    }
    if (this.Odonform.get('martes').value) {
      const martes = {
        dia: 'martes',
        horaInicio: this.horaInicioJ,
        horaFin: this.horaFinJ,
        horas: this.horas,
      };
      lista.push(martes);
    }
    if (this.Odonform.get('miércoles').value) {
      const miercoles = {
        dia: 'miércoles',
        horaInicio: this.horaInicioJ,
        horaFin: this.horaFinJ,
        horas: this.horas
      };
      lista.push(miercoles);
    }
    if (this.Odonform.get('jueves').value) {
      const jueves = {
        dia: 'jueves',
        horaInicio: this.horaInicioJ,
        horaFin: this.horaFinJ,
        horas: this.horas
      };
      lista.push(jueves);
    }
    if (this.Odonform.get('viernes').value) {
      const viernes = {
        dia: 'viernes',
        horaInicio: this.horaInicioJ,
        horaFin: this.horaFinJ,
        horas: this.horas
      };
      lista.push(viernes);
    }
    if (this.Odonform.get('sábado').value) {
      const sabado = {
        dia: 'sábado',
        horaInicio: this.horaInicioJ,
        horaFin: this.horaFinJ,
        horas: this.horas
      };
      lista.push(sabado);
    }
    this.odont.horario = lista;
  }


  close(): void {
    this.dialogRef.close();
  }

  check(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    if (event.keyCode > 31 && !this.allowedChars.has(event.keyCode)) {
      event.preventDefault();
    }
  }

  msgValidateEmail() {
    return this.Odonform.get('email').hasError('pattern') ? 'Correo electrónico invalido' :
    this.Odonform.get('email').hasError('required') ? 'Campo Requerido' :
     '';
  }

  msgValidateCedula() {
    return this.Odonform.get('cedula').hasError('required') ? 'Campo Requerido' :
           this.Odonform.get('cedula').hasError('minlength') ? 'La cédula debe tener 10 digitos' :
    '';
  }

}
