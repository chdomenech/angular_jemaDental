import { EspecialidadInterface } from './../../../../models/especialidad-model';
import { EspecialidadService } from './../../../../services/especialidad/especialidad.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NewEspecialidadComponent } from '../new-especialidad/new-especialidad.component';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-edit-especialidad',
  templateUrl: './edit-especialidad.component.html',
  styleUrls: ['./edit-especialidad.component.css']
})
export class EditEspecialidadComponent implements OnInit {

  especialidadForm = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl('', Validators.required),
  });

  constructor(
    private toastr: ToastrService,
    public espeService: EspecialidadService,
    private dialogRef: MatDialogRef<NewEspecialidadComponent>
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.especialidadForm.get('id').setValue(this.espeService.espeSelected.id);
    this.especialidadForm.get('nombre').setValue(this.espeService.espeSelected.nombre);
  }

  onSaveEspe(data: EspecialidadInterface) {
    data.nombre = data.nombre.toLowerCase();
    const espeFiltered = this.espeService.arrayEspe.find(espeFilterbynombre => espeFilterbynombre.nombre === data.nombre);

    if (((this.espeService.espeSelected.nombre === data.nombre) && espeFiltered) || espeFiltered === undefined) {
      this.espeService.updateEspecialidad(data);
      this.toastr.success('Registro actualizado exitosamente', 'MENSAJE');
      this.close();
    } else {
      this.toastr.warning('La especialidad ya se encuentra registrada', 'MENSAJE');
    }
  }

  close(): void {
  this.dialogRef.close();
  }

  msgValidateNombre() {
    return  this.especialidadForm.get('nombre').hasError('required') ? 'Campo obligatorio' :
            '';
  }

}
