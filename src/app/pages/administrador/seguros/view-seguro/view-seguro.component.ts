import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SeguroService } from 'src/app/services/seguro/seguro.service';
import { MatDialogRef } from '@angular/material';
import { EspecialidadService } from './../../../../services/especialidad/especialidad.service';

@Component({
  selector: 'app-view-seguro',
  templateUrl: './view-seguro.component.html',
  styleUrls: ['./view-seguro.component.css']
})
export class ViewSeguroComponent implements OnInit {

  seguroForm = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl(''),
    email:new FormControl(''),
    direccion:new FormControl(''),
    telefono:new FormControl(''), 
    sitioweb:new FormControl(''),       
  });

  especialidades:any;

  constructor(
    private toastr: ToastrService,
    public espeService: EspecialidadService,
    public seguroService: SeguroService,
    private dialogRef: MatDialogRef<ViewSeguroComponent>
  ) {
    dialogRef.disableClose = true;
  }
  ngOnInit() {

    this.seguroForm.get('id').setValue(this.seguroService.seguroSelected.id);
    this.seguroForm.get('nombre').setValue(this.seguroService.seguroSelected.nombre);
    this.seguroForm.get('direccion').setValue(this.seguroService.seguroSelected.direccion);
    this.especialidades= this.seguroService.seguroSelected.especialidades;
    this.seguroForm.get('telefono').setValue(this.seguroService.seguroSelected.telefono);
    this.seguroForm.get('email').setValue(this.seguroService.seguroSelected.email);
    this.seguroForm.get('sitioweb').setValue(this.seguroService.seguroSelected.sitioweb);
  }

  close(): void {
    this.dialogRef.close();
    }

}
