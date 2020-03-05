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
  selector: 'app-view-tratamiento',
  templateUrl: './view-tratamiento.component.html',
  styleUrls: ['./view-tratamiento.component.css']
})
export class ViewTratamientoComponent implements OnInit {

 
  actualizo: boolean;
  allowedChars = new Set('0123456789'.split('').map(c => c.charCodeAt(0)));

  TratamientoMform = new FormGroup({
    id: new FormControl(null),
    seguro: new FormControl(''),
    namepaciente: new FormControl(''),
    especialidad: new FormControl(''),
    cipaciente: new FormControl(''),
    odontologo: new FormControl(''),
    fecha: new FormControl(''),
    tratamiento: new FormControl(''),
    precio: new FormControl(''),
    sseguro: new FormControl(null),
      observacion: new FormControl(''),
  });

  valorseguro: string;
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
    private dialogRef: MatDialogRef<ViewTratamientoComponent>,
    @Inject(LOCALE_ID) private locale: string,
  ) {
    this.dateAdapter.setLocale('es');
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.getPacientandDentistList();
    this.actualizo = false;
    this.filteredOptions = this.TratamientoMform.get('cipaciente').valueChanges.pipe(
      startWith(''),
      map(value =>  value ? this._filter(value) : this.pactService.arrayPacientes.slice())
    );
  }

  filterhoursbyOdonto(dentistselected: any) {
    if (this.actualizo === false) {
      if (dentistselected) {
        const iddentist = dentistselected.cedula;
        this.dentistselected =  dentistselected;
      }
    }
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
    this.TratamientoMform.get('cipaciente').setValue(this.tratamientoMService.selectTratamientoM.cipaciente);
    this.TratamientoMform.get('namepaciente').setValue(this.tratamientoMService.selectTratamientoM.namepaciente);
    this.TratamientoMform.get('fecha').setValue(this.tratamientoMService.selectTratamientoM.fecha);
    this.TratamientoMform.get('seguro').setValue(this.tratamientoMService.selectTratamientoM.seguro);
    this.TratamientoMform.get('especialidad').setValue(this.tratamientoMService.selectTratamientoM.especialidad);
    this.TratamientoMform.get('odontologo').setValue(this.tratamientoMService.selectTratamientoM.nameodontologo);
    this.TratamientoMform.get('tratamiento').setValue(this.tratamientoMService.selectTratamientoM.tratamiento);
    this.TratamientoMform.get('observacion').setValue(this.tratamientoMService.selectTratamientoM.observacion);
    this.TratamientoMform.get('precio').setValue(this.tratamientoMService.selectTratamientoM.precio);
    this.TratamientoMform.get('sseguro').setValue(this.tratamientoMService.selectTratamientoM.sseguro);
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
    this.valorseguro = value.seguro;
    if(!this.TratamientoMform.get('sseguro').value){
      this.TratamientoMform.get('seguro').setValue(this.valorseguro);
    }else{
      this.TratamientoMform.get('seguro').setValue("Sin seguro");
    }
  }

  sinseguro(seguro:any){
    if(!this.TratamientoMform.get('sseguro').value){
      this.TratamientoMform.get('seguro').setValue(this.valorseguro);
    }else{
      this.TratamientoMform.get('seguro').setValue("Sin seguro");
    }
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
  
  close(): void {
    this.dialogRef.close();
  }
}