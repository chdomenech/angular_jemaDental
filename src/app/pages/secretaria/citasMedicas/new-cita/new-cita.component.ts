import { CitaService } from './../../../../services/cita/cita.service';
import { OdontologoService } from './../../../../services/odontologo/odontologo.service';
import { PacienteService } from './../../../../services/paciente/paciente.service';
import { EspecialidadService } from './../../../../services/especialidad/especialidad.service';
import { CitaMInterface } from './../../../../models/cita-model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { PacienteInterface } from 'src/app/models/paciente-model';
import { ToastrService } from 'ngx-toastr';
import { DateAdapter, MatDialogRef } from '@angular/material';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-new-cita',
  templateUrl: './new-cita.component.html',
  styleUrls: ['./new-cita.component.css']
})
export class NewCitaComponent implements OnInit {

  allowedChars = new Set('0123456789'.split('').map(c => c.charCodeAt(0)));

  CitaMform = new FormGroup({
    id: new FormControl(null),
    seguro: new FormControl(''),
    namepaciente: new FormControl(''),
    especialidad: new FormControl('', Validators.required),
    cipaciente: new FormControl('',  Validators.required),
    odontologo: new FormControl('',  Validators.required),
    hora: new FormControl('',  Validators.required),
    fecha: new FormControl('',  Validators.required),
    estado: new FormControl('',  Validators.required),
  });

  especialidadSelect: any[];
  filteredOptions: Observable<string[]>;
  minDate: Date = new Date();
  specialtiesSelected: string;
  pacientes: PacienteInterface[];
  pacient: PacienteInterface = {};
  odontEspecialidad: any[] = [];
  horariobyOdontologoList: string[] = [];
  allHours = [];
  dateSelected: Date;
  dentistselected: any;
  registeredMedicalAppointments: CitaMInterface[] = [];
  citasMedicasArray: CitaMInterface[] = [];
  citasFiltradas: CitaMInterface[];
  

  constructor(
    private toastr: ToastrService,
    public espeService: EspecialidadService,
    public pactService: PacienteService,
    private dateAdapter: DateAdapter<Date>,
    private citaMService: CitaService,
    public odontService: OdontologoService,
    private dialogRef: MatDialogRef<NewCitaComponent>,
    @Inject(LOCALE_ID) private locale: string,
  ) {
    this.dateAdapter.setLocale('es');
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.getRegisteredMedicalAppointments();
    this.filteredOptions = this.CitaMform.get('cipaciente').valueChanges.pipe(
      startWith(''),
      map(value =>  value ? this._filter(value) : this.pactService.arrayPacientes.slice())
    );

    this.especialidadSelect = this.getEspecialidades();
  }

  getEspecialidades():any[]{
    let especiadidadesArray = [];
    this.odontService.arrayOdontologos.map((odont) => {

      if(especiadidadesArray.length ==0 ){
        especiadidadesArray.push(odont.especialidad);
      }else if(!especiadidadesArray.find(val=>val.trim() === odont.especialidad.trim())){
        especiadidadesArray.push(odont.especialidad);
      }
    });
    return especiadidadesArray;
  }

  displayFn(subject) {
    return subject ? subject.cedula : undefined;
  }

  private _filter(value: any): string[] {
    const filterValue = value;
    this.setpacientvalue(value);
    return this.pactService.arrayPacientes.filter(option => option.cedula.indexOf(filterValue) === 0);
  }

  setpacientvalue(value: any) {
    this.CitaMform.get('namepaciente').setValue(value.nombre);
    this.CitaMform.get('seguro').setValue(value.seguro);
  }

  especialidad(val: any) {
    this.odontEspecialidad = [];
    this.specialtiesSelected = val;
    this.odontService.arrayOdontologos.map((odont) => {
      if (odont.especialidad === val.trim()) {
        this.odontEspecialidad.push(odont);
      }
    });
  }

  getRegisteredMedicalAppointments() {
    this.citaMService.getAllCitas().subscribe(rest => {
      this.registeredMedicalAppointments = rest;
    }, error => {
      throw error;
    });
  }

  filterhoursbyOdonto(dentistselected: any) {
    if (dentistselected) {
      const iddentist = dentistselected.cedula;
      this.dentistselected =  dentistselected;
      if (this.dateSelected && this.specialtiesSelected) {
        const arrayFiltered = this.registeredMedicalAppointments.filter(
        appointmentsFiltered => appointmentsFiltered.odontologo === iddentist
        && this.dateSelected.getTime() === appointmentsFiltered.fecha
        && this.specialtiesSelected === appointmentsFiltered.especialidad);
        const hoursbydentist: string[] = [];
        this.odontService.arrayOdontologos.forEach(dentisSelec => {
          if (dentisSelec.cedula === iddentist) {
            dentisSelec.horas.forEach(schedule => {
              if (this.convertNumbertoDay(this.dateSelected.getDay()) === schedule.dia) {
                schedule.horas.forEach(hours => { hoursbydentist.push(hours); });
              }
            });
          }
        });
        this.horariobyOdontologoList = JSON.parse( JSON.stringify(hoursbydentist ));
        if (this.horariobyOdontologoList.length > 0 && arrayFiltered.length > 0) {
          this.horariobyOdontologoList = JSON.parse( JSON.stringify(
          this.removeRegisteredHours(arrayFiltered, this.horariobyOdontologoList)));
        }
      }
      if (this.dateSelected && this.specialtiesSelected && this.dentistselected) {
        if (this.horariobyOdontologoList.length === 0) {
          this.toastr.info('Citas no disponibles', 'MENSAJE');
        }
      }
    }

  }

  removeRegisteredHours(arrayFilteredCita: any, horarioDentista: any[]): string[] {
    // List de horas reservadas
    const hoursReserved: string[] = [];
    arrayFilteredCita.forEach(reserved => {
      hoursReserved.push(reserved.hora);
    });
    const hourwithoutRegister: string[] = [];
    horarioDentista.forEach(hours => {
      const existHourinReservedList = hoursReserved.find(search => search === hours);
      if (!existHourinReservedList) {
        hourwithoutRegister.push(hours);
      }
    });
    return hourwithoutRegister;
}

  convertNumbertoDay(dayNumber: number): string {
    let dayname: string;
    const daysList = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
    if (dayNumber === 1) {
      dayname = daysList[0];
    }
    if (dayNumber === 2) {
      dayname = daysList[1];
    }
    if (dayNumber === 3) {
      dayname = daysList[2];
    }
    if (dayNumber === 4) {
      dayname = daysList[3];
    }
    if (dayNumber === 5) {
      dayname = daysList[4];
    }
    if (dayNumber === 6) {
      dayname = daysList[5];
    }
    if (dayNumber === 0) {
      dayname = daysList[6];
    }
    return dayname;
  }

  selectFecha(date: any) {
    this.dateSelected = date;
    const getdentisValue = this.CitaMform.get('odontologo').value;
    if (getdentisValue) {
      this.filterhoursbyOdonto(getdentisValue);
    }

    this.citasFiltradas = this.citaMService.citaArray;
  }

  validarCitaMedicaRegistrada(event){

    const ci = this.CitaMform.get('cipaciente').value;
    const fecha = this.CitaMform.get('fecha').value;
    const fechaT = Date.parse(fecha);
    const hora = this.CitaMform.get('hora').value;

   const valores = this.citasFiltradas.find(datosCitas=>datosCitas.cipaciente === ci.cedula && datosCitas.fecha === fechaT && datosCitas.hora === hora); 

   if(valores !== undefined){
      this.CitaMform.get('hora').setErrors({repeatHora:true})
      this.toastr.warning('El paciente ya tiene una cita medica registrada a esa hora', 'MENSAJE');  
    }
  }

  guardarCitaMedica(data: CitaMInterface) {
    
    const fecha = Date.parse(data.fecha);
    data.fecha = fecha;   
  
    let newdata: CitaMInterface;
    newdata = data;

    if (newdata.cipaciente) {

      if (this.existID_pacientList(newdata.cipaciente) === true) {
        newdata.cipaciente =  newdata.cipaciente.cedula;
        newdata.odontologo =  newdata.odontologo.cedula;
        newdata.nameodontologo = this.dentistselected.nombre;
        this.citaMService.addCitaM(newdata);
        this.toastr.success('Registro guardado exitosamente', 'MENSAJE');
        this.close();
      } else {
        this.toastr.error('El paciente  no se encuentra registrado', 'MENSAJE');
      }
    } else {
      this.toastr.warning('El paciente no se encuentra registrado', 'MENSAJE');
    }
  }

  existID_pacientList(cedula: any): boolean {
    let exist = false;
    if (cedula) {
      const pacientFiltered = this.pactService.arrayPacientes.find(pacientFilterbycedula => pacientFilterbycedula.cedula === cedula.cedula);
      if (pacientFiltered) {
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

  check(event: KeyboardEvent) {
    if (event.keyCode > 31 && !this.allowedChars.has(event.keyCode)) {
      event.preventDefault();
    }
  }

  getErrorMessageP() {
    return  this.CitaMform.get('cipaciente').hasError('required') ? 'Seleccione el paciente' : '';
  }

  getErrorMessageE() {
    return  this.CitaMform.get('especialidad').hasError('required') ? 'Seleccione la especialidad' : '';
  }

  getErrorMessageF() {
    return  this.CitaMform.get('fecha').hasError('required') ? 'Fecha incorrecta' : '';
  }

  getErrorMessageO() {
    return  this.CitaMform.get('odontologo').hasError('required') ? 'Seleccione el odontologo' : '';
  }

  getErrorMessageH() {
    return  this.CitaMform.get('hora').hasError('required') ? 'Seleccione la hora de la cita': 
            this.CitaMform.get('hora').hasError('repeatHora') ? 'El paciente ya tiene una cita a esa hora' 
    : '';
  }
  getErrorMessageEst() {
    return  this.CitaMform.get('estado').hasError('required') ? 'Seleccione el estado de la cita' : '';
  }

}