import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SeguroService } from 'src/app/services/seguro/seguro.service';
import { MatDialogRef } from '@angular/material';
import { SeguroInteface } from 'src/app/models/seguro-model';

@Component({
  selector: 'app-edit-seguro',
  templateUrl: './edit-seguro.component.html',
  styleUrls: ['./edit-seguro.component.css']
})
export class EditSeguroComponent implements OnInit {

  seguroForm = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl('', Validators.required),
  });

  constructor(
    private toastr: ToastrService,
    public seguroService: SeguroService,
    private dialogRef: MatDialogRef<EditSeguroComponent>
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.seguroForm.get('id').setValue(this.seguroService.seguroSelected.id);
    this.seguroForm.get('nombre').setValue(this.seguroService.seguroSelected.nombre);
  }

  onSaveSeguro(data: SeguroInteface) {
    data.nombre = data.nombre.toLowerCase();
    const seguroFiltered = this.seguroService.arraySeguros.find(espeFilterbynombre => espeFilterbynombre.nombre === data.nombre);

    if (((this.seguroService.seguroSelected.nombre === data.nombre) && seguroFiltered) || seguroFiltered === undefined) {
      this.seguroService.updateSeguro(data);
      this.toastr.success('Registro actualizado exitosamente', 'MENSAJE');
      this.close();
    } else {
      this.toastr.warning('El seguro ya se encuentra registrado', 'MENSAJE');
    }

  }

  close(): void {
  this.dialogRef.close();
  }

  msgValidateNombre() {
    return  this.seguroForm.get('nombre').hasError('required') ? 'Campo obligatorio' : '';
  }

}
