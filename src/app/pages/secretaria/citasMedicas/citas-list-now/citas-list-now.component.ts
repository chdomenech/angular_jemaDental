import { EspecialidadService } from './../../../../services/especialidad/especialidad.service';
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
  selector: 'app-citas-list-now',
  templateUrl: './citas-list-now.component.html',
  styleUrls: ['./citas-list-now.component.css']
})
export class CitasListNowComponent implements OnInit {
  myDate = Date.now();

  dentistList: any[] = [];
  fecha: any;
  displayedColumns: string[] = ['fecha', 'hora', 'cipaciente', 'namepaciente' , 'nameodontologo',  'seguro', 'estado', 'accion'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    public router: Router,
    public authService: AuthService,
    private toastr: ToastrService,
    private citaMService: CitaService,
    public odontService: OdontologoService,
    public espeService: EspecialidadService,
    private dialog: MatDialog,
    private readonly afs: AngularFirestore
  ) { }

  ngOnInit() {

    this.citaMService.getAllCitasMedicasNow().subscribe(citaMedica => {
      this.dataSource.data = citaMedica;
      const tam = Object.keys(this.dataSource.data).length;
      for (let i = 0; i< tam; i++){
        const element = this.dataSource.data[i];
        this.fecha = new Date(element['fecha']);
        this.dataSource.data[i]['fecha'] = this.citaMService.formtDate(this.fecha);
      }
    });
    this.dataSource.paginator = this.paginator;
    this.getDentistList();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getDentistList() {
    this.odontService.getAllOdontologos().subscribe(rest => {
      this.dentistList = rest;
    }, error => {
      throw error;
    });
  }

   onEdit(element) {
    this.openDialogEdit();
    if (element) {
       this.citaMService.selectCitaM = Object.assign({}, element);
     }
  }
  openDialogEdit(): void {
    this.dialog.open(EditCitaComponent);
  }
}


