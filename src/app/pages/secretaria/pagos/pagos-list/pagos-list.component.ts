import { Component, OnInit, ViewChild } from '@angular/core';
import { TratamientoService } from './../../../../services/tratamiento/tratamiento.service';
import { PagoService } from './../../../../services/pago/pago.service';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EditTratamientoComponent } from './../../tratamientos/edit-tratamiento/edit-tratamiento.component';
import { ViewTratamientoComponent } from './../../tratamientos/view-tratamiento/view-tratamiento.component';
import { NewPagoComponent } from './../new-pago/new-pago.component';

@Component({
  selector: 'app-pagos-list',
  templateUrl: './pagos-list.component.html',
  styleUrls: ['./pagos-list.component.css']
})

export class PagosListComponent implements OnInit {

  myDate = Date.now();

  dentistList: any[] = [];
  fecha: any;
  displayedColumns: string[] = ['numero', 'fechaPago', 'cedulaPaciente', 'nombrePaciente', 'seguro','tratamiento', 'valorPago', 'accion'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    public router: Router,
    public authService: AuthService,
    private toastr: ToastrService,
    private tratamientoMService: TratamientoService,
    private pagoMService: PagoService,
    private dialog: MatDialog,
    private readonly afs: AngularFirestore
  ) { }

  ngOnInit() {

    this.tratamientoMService.getAllTratamientosMedicos().subscribe(tratamientoMedico => {
      this.dataSource.data = tratamientoMedico;
      const tam = Object.keys(this.dataSource.data).length;
      for (let i = 0; i< tam; i++){
        const element = this.dataSource.data[i];
        this.fecha = new Date(element['fecha']);
        this.dataSource.data[i]['fecha'] = this.tratamientoMService.formtDate(this.fecha);
      }
    });
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onNew() {
    this.openDialogNew();
  }

  onEdit(element) {
    this.openDialogEdit();
    if (element) {
      this.tratamientoMService.selectTratamientoM = Object.assign({}, element);
     }
  }

  onView(element) {
    this.openDialogView();
    if (element) {
      this.tratamientoMService.selectTratamientoM = Object.assign({}, element);
     }
  }

  openDialogNew(): void {
    this.dialog.open(NewPagoComponent);
  }

  openDialogEdit(): void {
   this.dialog.open(EditTratamientoComponent);
  }

  openDialogView(): void {
    this.dialog.open(ViewTratamientoComponent);
  }

}