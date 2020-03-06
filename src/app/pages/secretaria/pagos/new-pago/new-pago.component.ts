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
import { PagosInterface } from 'src/app/models/pago-model';
import { PagoService } from './../../../../services/pago/pago.service';


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
  seguroArraySelect =[];
  tratamientoSelected: TratamientoMInterface= {};
  seguroSelected: any;

  pagoForm = new FormGroup({
    id: new FormControl(null),
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
    private pagoMService: PagoService,
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
    }

  tratamiento(val: TratamientoMInterface = {}) {
    if(val !== undefined && val!=null){
      this.tratamientoSelected = val;
      this.pagoForm.get('valorPago').setValue(val.precio);
      this.obtenerPagos(val);
    }
  }

  seguro(val:any){
    if(val !== undefined && val!= null){
      this.tratamientosArraySelect = val.tratamientos;
      this.seguroSelected = val.seguro;   
      this.pagoForm.get('ultimoValorCancelado').setValue(null);
      this.pagoForm.get('valorPendiente').setValue(null);
      this.pagoForm.get('valorPago').setValue(null);      
    }
  }

  obtenerPagos(val: TratamientoMInterface = {}){
    this.pagoForm.get('valorPago').setValue(val.precio);
    this.pagoMService.getAllPagosByParams(this.seguroSelected,this.tratamientoSelected.tratamiento,
      this.tratamientoSelected.cipaciente).subscribe(pago => {

        if(pago!=null &&  pago.length>0){          
          this.pagoForm.get('ultimoValorCancelado').setValue(pago[pago.length - 1].valorPago);
          const totalPagado = pago.reduce((acc, pago) => acc + pago.valorPago, 0);
          const totalAPagar =  Number.parseFloat(val.precio) - totalPagado;
          this.pagoForm.get('valorPendiente').setValue(totalAPagar);

        }else{
          this.pagoForm.get('ultimoValorCancelado').setValue(0);
          this.pagoForm.get('valorPendiente').setValue(val.precio);    
        }
    });
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
    this.seguroArraySelect = this.generateSeguroCombo(value.tratamientos);
    this.nulearvalores();
  }

  nulearvalores(){
    this.pagoForm.get('ultimoValorCancelado').setValue(null);
    this.pagoForm.get('valorPendiente').setValue(null);
    this.pagoForm.get('valorPago').setValue(null);
    this.pagoForm.get('seguro').setValue(null);
    this.pagoForm.get('tratamiento').setValue(null);
  }

  generateSeguroCombo(datainfo :any[]) : string[]{ 
    let seguros = [];
    this.tratamientosArraySelect = [];
    this.nulearvalores();
    
    if(datainfo!== undefined){
      datainfo.forEach(function (data) {
        if(seguros.length===0){
          seguros.push({seguro: data.seguro, cedula:data.cipaciente, tratamientos:[data]});
        }else if(!seguros.find( dato=>dato.seguro === data.seguro)){
          seguros.push({seguro: data.seguro, cedula:data.cipaciente, tratamientos:[data]});
        }else{
          const seguro= seguros.find( dato=>dato.seguro === data.seguro);
          seguro.tratamientos.push(data);
        }
      });
    }    
    return seguros;
  }
 
  savePago(data: any) {
      let newdata: PagosInterface;
      const fecha = Date.parse(data.fechaPago);
      data.fechaPago = fecha;
      data.cedulaPaciente = data.cedulaPaciente.cedula;
      data.seguro =  data.seguro.seguro;
      data.tratamiento =  data.tratamiento.tratamiento;
      const valorPagar = Number.parseFloat(data.valorPagar);
      const valorPendiente =  Number.parseFloat(data.valorPendiente);
      data.valorPago  = valorPagar;
      delete data.valorPagar;
      delete data.ultimoValorCancelado;
      delete data.valorPendiente;
      newdata = data;
      
      if(valorPendiente==0){
        this.toastr.warning('No hay valores pendientes para este tratamiento', 'MENSAJE');
      }else if(valorPagar>valorPendiente){
        this.toastr.warning('El valor a pagar supera el valor pendiente', 'MENSAJE');
      }else if (newdata) {  
        this.pagoMService.addPago(newdata);
        this.toastr.success('Registro guardado exitosamente', 'MENSAJE');
        this.close();
      }else{
        this.toastr.error('El paciente no se encuentra registrado', 'MENSAJE');
      }      
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
