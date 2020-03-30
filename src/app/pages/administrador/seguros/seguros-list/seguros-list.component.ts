import { EditSeguroComponent } from './../edit-seguro/edit-seguro.component';
import { ViewSeguroComponent } from './../view-seguro/view-seguro.component';
import { NewSeguroComponent } from './../new-seguro/new-seguro.component';
import { SeguroService } from './../../../../services/seguro/seguro.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-seguros-list',
  templateUrl: './seguros-list.component.html',
  styleUrls: ['./seguros-list.component.css']
})
export class SegurosListComponent implements OnInit {

  displayedColumns: string[] = ['numero', 'nombre','telefono','direccion','email','accion'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    public router: Router,
    public authService: AuthService,
    private toastr: ToastrService,
    private seguroService: SeguroService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.seguroService.getAllSeguros().subscribe(seguros => this.dataSource.data = seguros);
    this.dataSource.paginator = this.paginator;
  }

  onNew() {
    this.openDialogNew();
  }

  onEdit(element) {
    this.openDialogEdit();
    if (element) {
      this.seguroService.seguroSelected = Object.assign({}, element);
    }
  }

  onView(element){
    this.openDialogView();
    if (element) {
      this.seguroService.seguroSelected = Object.assign({}, element);
    }
  }

  onDelete(element) {
    const confirmacion = confirm('¿Estas seguro de eliminar este seguro?');
    if (confirmacion) {
      this.seguroService.deleteSeguro(element);
      this.toastr.success('Registro eliminado exitosamente', 'MENSAJE');
    }
  }

  openDialogView() {
    this.dialog.open(ViewSeguroComponent);
  }

  openDialogNew() {
    this.dialog.open(NewSeguroComponent);
  }

  openDialogEdit() {
    this.dialog.open(EditSeguroComponent);
  }

}
