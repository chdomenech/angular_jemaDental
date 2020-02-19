import {TratamientoService } from './../../../../services/tratamiento/tratamiento.service';
import { OdontologoService } from './../../../../services/odontologo/odontologo.service';
import { PacienteService } from './../../../../services/paciente/paciente.service';
import { EspecialidadService } from './../../../../services/especialidad/especialidad.service';
import { TratamientoMInterface } from './../../../../models/tratamiento.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { PacienteInterface } from 'src/app/models/paciente-model';
import { ToastrService } from 'ngx-toastr';
import { DateAdapter, MatDialogRef } from '@angular/material';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-tratamiento',
  templateUrl: './edit-tratamiento.component.html',
  styleUrls: ['./edit-tratamiento.component.css']
})
export class EditTratamientoComponent implements OnInit {

  actualizo: boolean;
  allowedChars = new Set('0123456789'.split('').map(c => c.charCodeAt(0)));

  TratamientoMform = new FormGroup({
    id: new FormControl(null),
    seguro: new FormControl(''),
    namepaciente: new FormControl(''),
    especialidad: new FormControl('', Validators.required),
    cipaciente: new FormControl('',  Validators.required),
    odontologo: new FormControl('',  Validators.required),
    fecha: new FormControl('',  Validators.required),
    tratamiento: new FormControl('',  Validators.required),
    precio: new FormControl(''),
    //noaplica_seguro: new FormControl(''),
    observacion: new FormControl(''),
  });

  filteredOptions: Observable<string[]>;
  minDate: Date = new Date();
  specialtiesSelected: string;
  pacientes: PacienteInterface[];
  pacient: PacienteInterface = {};
  odontEspecialidad: any[] = [];
  allHours = [];
  dateSelected: Date;
  dentistselected: any;
  registeredMedicalTratamientos: TratamientoMInterface[] = [];

    // Lista de pacientes
    pacientList: any[] = [];
    // Lista odontologos
    dentistList: any[] = [];

  constructor(
    private toastr: ToastrService,
    public espeService: EspecialidadService,
    public pactService: PacienteService,
    private dateAdapter: DateAdapter<Date>,
    private tratamientoMService: TratamientoService,
    public odontService: OdontologoService,
    private dialogRef: MatDialogRef<EditTratamientoComponent>,
    @Inject(LOCALE_ID) private locale: string,
  ) {
    this.dateAdapter.setLocale('es');
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.getPacientandDentistList();
    this.filteredOptions = this.TratamientoMform.get('cipaciente').valueChanges.pipe(
      startWith(''),
      map(value =>  value ? this._filter(value) : this.pactService.arrayPacientes.slice())
    );
  }


  getPacientandDentistList() {
    this.pactService.getAllPacientes().subscribe(restPacient => {
      this.pacientList = restPacient;
      this.odontService.getAllOdontologos().subscribe(restDentist => {
        this.dentistList = restDentist;
        this.tratamientoMService.getAllTratamientosMedicos().subscribe(restTratamiento => {
          this.registeredMedicalTratamientos = restTratamiento;
          this.setDataTratamientoM();
        });
      });
    });
  }

  setDataTratamientoM() {
    const pacientefiltered = this.pacientList.find(search => search.cedula === this.tratamientoMService.selectTratamientoM.cipaciente);
    this.TratamientoMform.get('id').setValue(this.tratamientoMService.selectTratamientoM.id);
    this.TratamientoMform.get('cipaciente').setValue(pacientefiltered);
    const parts = this.tratamientoMService.selectTratamientoM.fecha.split('/');
    const newdate = new Date(parts[2], (parts[1] - 1), parts[0]);
    this.TratamientoMform.get('fecha').setValue(newdate);
    this.TratamientoMform.get('seguro').setValue(this.tratamientoMService.selectTratamientoM.seguro);
    this.TratamientoMform.get('especialidad').setValue(this.tratamientoMService.selectTratamientoM.especialidad);


    

    const dentistSelected = this.odontEspecialidad.find(search => search.cedula === this.tratamientoMService.selectTratamientoM.odontologo);
    
    console.log("medico",dentistSelected);
    this.TratamientoMform.get('odontologo').setValue(dentistSelected);
    this.TratamientoMform.get('tratamiento').setValue(this.tratamientoMService.selectTratamientoM.tratamiento);
    this.TratamientoMform.get('observacion').setValue(this.tratamientoMService.selectTratamientoM.observacion);
    this.TratamientoMform.get('precio').setValue(this.tratamientoMService.selectTratamientoM.precio);
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
    this.TratamientoMform.get('namepaciente').setValue(value.nombre);
    this.TratamientoMform.get('seguro').setValue(value.seguro);
  }

  selectedMedico(dentistselected: any) {
    if (dentistselected) {
        this.dentistselected =  dentistselected;
    }
  }  


  especialidad(val: any) {
    if (this.actualizo === false) {
      this.odontEspecialidad = [];
      this.specialtiesSelected = val;
      this.odontService.arrayOdontologos.map((odont) => {
        if (odont.especialidad === val) {
          this.odontEspecialidad.push(odont);
        }
      });

    }
  }

  selectFecha(date: any) {
    this.dateSelected = date;
  }


       
  guardarTratamientoMedico(data: TratamientoMInterface) {
    const fecha = Date.parse(data.fecha);
    data.fecha = fecha;
    // objeto modificado
    let newdata: TratamientoMInterface;
    newdata = data;

    if (newdata.cipaciente) {

      if (this.existID_pacientList(newdata.cipaciente) === true) {
        newdata.cipaciente =  newdata.cipaciente.cedula;
        newdata.odontologo =  newdata.odontologo.cedula;
        newdata.nameodontologo = this.dentistselected.nombre;
        this.tratamientoMService.updateTratamientoM(newdata);
        this.actualizo = true;
        this.toastr.success('Registro actualizado con Exitoso', 'MENSAJE');
        this.close();
      } else {
        this.toastr.error('El paciente  no se encuentra registrado', 'MENSAJE');
      }
    } else {
      console.log('el no se encuentra registrado');
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

 // Funcion: permitir solo numeros
 check(event: KeyboardEvent) {
    if (event.keyCode > 31 && !this.allowedChars.has(event.keyCode)) {
      event.preventDefault();
    }
  }

  getErrorMessageP() {
    return  this.TratamientoMform.get('cipaciente').hasError('required') ? 'Seleccione el paciente' : '';
  }

  getErrorMessageE() {
    return  this.TratamientoMform.get('especialidad').hasError('required') ? 'Seleccione la especialidad' : '';
  }

  getErrorMessageF() {
    return  this.TratamientoMform.get('fecha').hasError('required') ? 'Fecha incorrecta' : '';
  }

  getErrorMessageO() {
    return  this.TratamientoMform.get('odontologo').hasError('required') ? 'Seleccione el odontologo' : '';
  }

}
