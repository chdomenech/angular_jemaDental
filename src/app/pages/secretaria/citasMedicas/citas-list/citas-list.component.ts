import { EspecialidadService } from './../../../../services/especialidad/especialidad.service';
import { NewCitaComponent } from './../new-cita/new-cita.component';
import { OdontologoService } from './../../../../services/odontologo/odontologo.service';
import { CitaService } from './../../../../services/cita/cita.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';
import { EditCitaComponent } from '../edit-cita/edit-cita.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-citas-list',
  templateUrl: './citas-list.component.html',
  styleUrls: ['./citas-list.component.css']
})
export class CitasListComponent implements OnInit {

  myDate = Date.now();

  dentistList: any[] = [];
  fecha: any;
  displayedColumns: string[] = ['fecha', 'hora', 'cipaciente', 'namepaciente' , 'nameodontologo', 'seguro', 'estado', 'accion'];
  dataSourceCitas = new MatTableDataSource();
  @ViewChild(MatPaginator, {static: true}) paginatorCitas: MatPaginator;

  constructor(
    public router: Router,
    public authService: AuthService,
    private toastr: ToastrService,
    private citaMService1: CitaService,
    public odontService: OdontologoService,
    public espeService: EspecialidadService,
    private dialog: MatDialog,
    private readonly afs: AngularFirestore
  ) { 

  }

  ngOnInit() {
    this.getCitas();
  }

  getCitas(){
    this.citaMService1.getAllCitas().subscribe(citaMedica1 => {

      this.dataSourceCitas.data = citaMedica1;
      const tam = Object.keys(this.dataSourceCitas.data).length;
      for (let i = 0; i< tam; i++){
        const element = this.dataSourceCitas.data[i];
        this.fecha = new Date(element['fecha']);
        this.dataSourceCitas.data[i]['fecha'] = this.citaMService1.formtDate(this.fecha);
      }
    });

    this.dataSourceCitas.paginator = this.paginatorCitas;
    this.getDentistList();

  }

  applyFilter(filterValue: string) {
    this.dataSourceCitas.filter = filterValue.trim().toLowerCase();1
  }

  getDentistList() {
    this.odontService.getAllOdontologos().subscribe(rest => {
      this.dentistList = rest;
    }, error => {
      throw error;
    });
  }

  onNew() {
    this.openDialogNew();
  }

  onEdit(element) {
    this.openDialogEdit();
    if (element) {
       this.citaMService1.selectCitaM = Object.assign({}, element);
     }
  }

  openDialogNew(): void {
    this.dialog.open(NewCitaComponent);
  }

  openDialogEdit(): void {
    this.dialog.open(EditCitaComponent);
  }

  onDelete(element) {
    const confirmacion = confirm('¿Estas seguro de eliminar la cita medica?');
    if (confirmacion) {
      this.citaMService1.deleteCitaM(element);
      this.toastr.success('Cita médica eliminada exitosamente', 'MENSAJE');
    }
  }

}
