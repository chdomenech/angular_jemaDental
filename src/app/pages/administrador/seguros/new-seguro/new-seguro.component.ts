import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SeguroService } from 'src/app/services/seguro/seguro.service';
import { MatDialogRef } from '@angular/material';
import { SeguroInteface } from 'src/app/models/seguro-model';

@Component({
  selector: 'app-new-seguro',
  templateUrl: './new-seguro.component.html',
  styleUrls: ['./new-seguro.component.css']
})
export class NewSeguroComponent implements OnInit {

  seguroForm = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl('', Validators.required),
  });

  constructor(
    private toastr: ToastrService,
    public seguroService: SeguroService,
    private dialogRef: MatDialogRef<NewSeguroComponent>
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
  }

  onSaveSeguro(data: SeguroInteface) {
    data.nombre = data.nombre.toLowerCase();
    if (this.existSeguro(data.nombre) === true) {
      this.toastr.warning('El seguro ya se encuentra registrado', 'MENSAJE');
    } else {
      this.seguroService.addSeguro(data);
      this.toastr.success('Registro actualizado exitosamente', 'MENSAJE');
      this.close();
    }
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

}
