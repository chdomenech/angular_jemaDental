import { EspecialidadService } from './../../../../services/especialidad/especialidad.service';
import { PacienteService } from './../../../../services/paciente/paciente.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TratamientoService } from 'src/app/services/tratamiento/tratamiento.service';
import { SeguroService } from 'src/app/services/seguro/seguro.service';
import { MatDialogRef } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { TratamientoMInterface } from 'src/app/models/tratamiento.model';


@Component({
  selector: 'app-new-pago',
  templateUrl: './new-pago.component.html',
  styleUrls: ['./new-pago.component.css']
})
export class NewPagoComponent implements OnInit {

  valorPatern = /^\d+(?:[.,]\d+)?$/;
  allowedChars = new Set('0123456789'.split('').map(c => c.charCodeAt(0)));
  dateSelected: Date;
  minDate: Date = new Date();
  tratamientosArray = [];
  tratamientosArraySelect = [];
  tratamientoSelected: TratamientoMInterface= {};


    pagoForm = new FormGroup({
      id: new FormControl(''),
      fechaPago: new FormControl('', Validators.required),
      cedulaPaciente: new FormControl('', Validators.required),
      seguro: new FormControl(''),
      tratamiento:  new FormControl('', Validators.required),
      nombrePaciente:  new FormControl('', Validators.required),
      valorPagar: new FormControl('', [Validators.required, Validators.pattern(this.valorPatern)]),
      ultimoValorCancelado: new FormControl(''),
      valorPago: new FormControl(''),
      valorPendiente: new FormControl(''),
      
    });

  filteredOptions: Observable<string[]>;

  constructor(
    private toastr: ToastrService,
    public tratamientoService: TratamientoService,    
    public pactService: PacienteService,
    public pacienteService: PacienteService,
    public espeService: EspecialidadService,
    public seguroService: SeguroService,
    private dialogRef: MatDialogRef<NewPagoComponent>,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.procesarTratamientos();
    this.filteredOptions = this.pagoForm.get('cedulaPaciente').valueChanges
    .pipe(
      startWith(''),
      map(value =>  value ? this._filter(value) : this.tratamientosArray.slice())
    );    
  }

  procesarTratamientos(){

    const datainfo = this.tratamientoService.TratamientosArray;
    let tratamientosHere = [];
    
    datainfo.forEach(function (data) {

      const cipaciente = data.cipaciente;
      const namepaciente = data.namepaciente;
      let datostratamiento : TratamientoMInterface[];
      datostratamiento = datainfo.filter(dato => dato.cipaciente === cipaciente);

      if(tratamientosHere.filter(info => info.cedula === cipaciente).length==0){
        tratamientosHere.push({
          cedula: cipaciente,
          nombre: namepaciente,
          tratamientos: datostratamiento
         });
      }
     });

     this.tratamientosArray = tratamientosHere; 
     console.log("this.tratamientosArray --- >",this.tratamientosArray);
  }


  tratamiento(val: TratamientoMInterface = {}) {
    this.tratamientoSelected = val;
    this.pagoForm.get('seguro').setValue(val.seguro);
    this.pagoForm.get('valorPago').setValue(val.precio);
    this.obtenerPagos(val);
  }

  obtenerPagos(val: TratamientoMInterface = {}){
  
    this.pagoForm.get('valorPago').setValue(val.precio);

    if(val.pagos === undefined || val.pagos === null || val.pagos.length == 0){
      this.pagoForm.get('ultimoValorCancelado').setValue(0);
      this.pagoForm.get('valorPendiente').setValue(val.precio);

    }else if(val.pagos.length>0){
      const totalPagado = val.pagos.reduce((acc, pago) => acc + Number.parseFloat(pago.pago), 0);
      const ultimoValorPagado = val.pagos[val.pagos.length-1];

      const totalAPagar = Number.parseFloat(val.precio) - Number.parseFloat(totalPagado);

      this.pagoForm.get('ultimoValorCancelado').setValue(ultimoValorPagado.pago);
      this.pagoForm.get('valorPendiente').setValue(totalAPagar);
    }
  }

  displayFn(subject) {
    return subject ? subject.cedula : undefined;
  }

  selectFecha(date: any) {
    this.dateSelected = date;
  }

  private _filter(value: string): string[] {

    const filterValue = value;
    this.setpacientvalue(value);
    return this.tratamientosArray.filter(option => option.cedula.indexOf(filterValue) === 0);
  }

  setpacientvalue(value: any) {
    this.pagoForm.get('nombrePaciente').setValue(value.nombre);
    this.tratamientosArraySelect =value.tratamientos;   
    this.pagoForm.get('ultimoValorCancelado').setValue(null);
    this.pagoForm.get('valorPendiente').setValue(null);
    this.pagoForm.get('valorPago').setValue(null);
    this.pagoForm.get('seguro').setValue(null);
  }
 
 
  savePago() {

    console.log( this.tratamientoSelected);

      let newdata: TratamientoMInterface;
      newdata = this.tratamientoSelected;

      if(newdata.pagos === undefined){
        newdata.pagos= [];  
      }

      const valorPagado = this.pagoForm.get('valorPagar').value;


      newdata.pagos.push({pago: valorPagado, fecha: this.dateSelected});

      console.log(newdata);

      if (newdata) {
        this.tratamientoService.updateTratamientoM(newdata);
        this.toastr.success('Registro guardado exitosamente', 'MENSAJE');
        this.close();
      }else{
        this.toastr.error('El paciente no se encuentra registrado', 'MENSAJE');
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

  errorMessageValor() {
    return this.pagoForm.get('valorPago').hasError('pattern') ? 'Valor Incorrecto' :
           this.pagoForm.get('valorPago').hasError('required') ? 'Campo Obligatorio' :
            '';
  }

  errorMessageDate() {
    return this.pagoForm.get('fechaPago').hasError('required') ? 'Fecha Incorrecta' :
           '';
  }
  check(event: KeyboardEvent) {
    if (event.keyCode > 31 && !this.allowedChars.has(event.keyCode)) {
      event.preventDefault();
    }
  }

  close() {
    this.dialogRef.close();
  }

}
