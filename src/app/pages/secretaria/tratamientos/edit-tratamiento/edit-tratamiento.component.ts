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
import { SeguroService } from './../../../../services/seguro/seguro.service';

@Component({
  selector: 'app-edit-tratamiento',
  templateUrl: './edit-tratamiento.component.html',
  styleUrls: ['./edit-tratamiento.component.css']
})
export class EditTratamientoComponent implements OnInit {
  especialidadSelect:any; 
  valorPatern = /^\d+(?:[.,]\d+)?$/;
  actualizo: boolean;
  allowedChars = new Set('0123456789.'.split('').map(c => c.charCodeAt(0)));

  TratamientoMform = new FormGroup({
    id: new FormControl(null),
    seguro: new FormControl(''),
    namepaciente: new FormControl(''),
    especialidad: new FormControl('', Validators.required),
    cipaciente: new FormControl('',  Validators.required),
    odontologo: new FormControl('',  Validators.required),
    fecha: new FormControl('',  Validators.required),
    tratamiento: new FormControl('',  Validators.required),
    precio: new FormControl('', [Validators.required, Validators.pattern(this.valorPatern)]),
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
    public seguroService: SeguroService,
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
    this.actualizo = false;
    this.filteredOptions = this.TratamientoMform.get('cipaciente').valueChanges.pipe(
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
    this.TratamientoMform.get('cipaciente').setValue(pacientefiltered);
    const parts = this.tratamientoMService.selectTratamientoM.fecha.split('/');
    const newdate = new Date(parts[2], (parts[1] - 1), parts[0]);
    this.TratamientoMform.get('fecha').setValue(newdate);
    this.TratamientoMform.get('seguro').setValue(this.tratamientoMService.selectTratamientoM.seguro);
    this.TratamientoMform.get('especialidad').setValue(this.tratamientoMService.selectTratamientoM.especialidad);
    const dentistSelected = this.odontEspecialidad.find(search => search.cedula === this.tratamientoMService.selectTratamientoM.odontologo);
    this.TratamientoMform.get('odontologo').setValue(dentistSelected);
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
      this.TratamientoMform.get('seguro').setValue("No aplica");
    }
  }

  sinseguro(seguro:any){
    if(!this.TratamientoMform.get('sseguro').value){
      this.TratamientoMform.get('seguro').setValue(this.valorseguro);
    }else{
      this.TratamientoMform.get('seguro').setValue("No aplica");
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
    const seguro = this.TratamientoMform.get('seguro').value;    
    if(seguro !== "No aplica" && !this.TratamientoMform.get('sseguro').value){
      
      this.seguroService.getSegurosByNameAndEspecialidad(seguro,val).subscribe(res => {
       if (Object.keys(res).length === 0) {
          this.toastr.warning('El seguro del paciente no cubre esta especialidad medica', 'MENSAJE');
          return  this.TratamientoMform.get('cipaciente').hasError('required');
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
        newdata.precio = Number.parseFloat(newdata.precio);
        this.seguroService.getSegurosByNameAndEspecialidad(newdata.seguro,newdata.especialidad).subscribe(res => {
          if (Object.keys(res).length === 0 && !this.TratamientoMform.get('sseguro').value) {
            this.toastr.error('El seguro del paciente no cubre esta especialidad medica', 'MENSAJE');
          }else{
            this.tratamientoMService.updateTratamientoM(newdata);
            this.actualizo = true;          
            this.toastr.success('Registro actualizado exitosamente', 'MENSAJE');
            this.close();
          }
        });
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
   var preg = /^([0-9]+\.?[0-9]{0,2})$/; 
    if (preg.test(event.key) !== true){
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
