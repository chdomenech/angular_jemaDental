import { EditPagoComponent } from './../edit-pago/edit-pago.component';
import { NewPagoComponent } from './../new-pago/new-pago.component';
import { PacienteService } from './../../../../services/paciente/paciente.service';
import { PagoService } from './../../../../services/pago/pago.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { SeguroService } from 'src/app/services/seguro/seguro.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-pagos-list',
  templateUrl: './pagos-list.component.html',
  styleUrls: ['./pagos-list.component.css']
})
export class PagosListComponent implements OnInit {

  displayedColumns: string[] = ['numero', 'fechaPago', 'cedulaPaciente', 'nombrePaciente', 'asuntoPago', 'valorPago', 'accion'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    public router: Router,
    public authService: AuthService,
    private toastr: ToastrService,
    public pagoService: PagoService,
    private dialog: MatDialog,
    private seguroService: SeguroService,
    private pacienteService: PacienteService
  ) { }

  ngOnInit() {

    this.pagoService.getAllPagos().subscribe(pago => {
      this.dataSource.data = pago;
    });
    this.dataSource.paginator = this.paginator;
  }P
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEdit(element) {
    this.openDialogEdit();
    if (element) {
      this.pagoService.pagoSelected = Object.assign({}, element);
    }
  }

  onNew() {
    this.openDialogNew();
   }

  openDialogNew(): void {
    this.dialog.open(NewPagoComponent);
  }

  openDialogEdit(): void {
    this.dialog.open(EditPagoComponent);
  }

}
