import { EspecialidadService } from './../../../../services/especialidad/especialidad.service';
import { PacienteService } from './../../../../services/paciente/paciente.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PagoService } from 'src/app/services/pago/pago.service';
import { SeguroService } from 'src/app/services/seguro/seguro.service';
import { MatDialogRef } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { PagosInterface } from 'src/app/models/pago-model';

@Component({
  selector: 'app-new-pago',
  templateUrl: './new-pago.component.html',
  styleUrls: ['./new-pago.component.css']
})
export class NewPagoComponent implements OnInit {

  valorPatern = /^\d+(?:[.,]\d+)?$/;
  allowedChars = new Set('0123456789'.split('').map(c => c.charCodeAt(0)));

    pagoForm = new FormGroup({
      id: new FormControl(''),
      fechaPago: new FormControl('', Validators.required),
      cedulaPaciente: new FormControl('', Validators.required),
      nombrePaciente: new FormControl(''),
      asuntoPago: new FormControl('', Validators.required),
      valorPago: new FormControl('', [Validators.required, Validators.pattern(this.valorPatern)]),
    });

  filteredOptions: Observable<string[]>;

  constructor(
    private toastr: ToastrService,
    public pagoService: PagoService,
    public pacienteService: PacienteService,
    public espeService: EspecialidadService,
    public seguroService: SeguroService,
    private dialogRef: MatDialogRef<NewPagoComponent>,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.filteredOptions = this.pagoForm.get('cedulaPaciente').valueChanges
    .pipe(
      startWith(''),
      map(value =>  value ? this._filter(value) : this.pacienteService.arrayPacientes.slice())
    );
  }

  displayFn(subject) {
    return subject ? subject.cedula : undefined;
  }

  private _filter(value: string): string[] {
    const filterValue = value;
    this.setpacientvalue(value);
    return this.pacienteService.arrayPacientes.filter(option => option.cedula.indexOf(filterValue) === 0);
  }

  setpacientvalue(value: any) {
    this.pagoForm.get('nombrePaciente').setValue(value.nombre);
  }

  savePago(data: PagosInterface) {
    data.cedulaPaciente = data.cedulaPaciente['cedula'];
    const pacientFilteredC = this.pacienteService.arrayPacientes.find(
      pacientFilterbycedula => pacientFilterbycedula.cedula === data.cedulaPaciente);
    if (pacientFilteredC !== undefined) {
      const fecha = Date.parse(data.fechaPago);
      data.fechaPago = fecha;
      this.pagoService.addPago(data);
      this.toastr.success('Registro guardado exitosamente', 'MENSAJE');
      this.close();
    } else {
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
    // tslint:disable-next-line: deprecation
    if (event.keyCode > 31 && !this.allowedChars.has(event.keyCode)) {
      event.preventDefault();
    }
  }

  close() {
    this.dialogRef.close();
  }

}
