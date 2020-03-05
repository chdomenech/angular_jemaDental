import { NewEspecialidadComponent } from './../new-especialidad/new-especialidad.component';
import { EspecialidadService } from './../../../../services/especialidad/especialidad.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { EditEspecialidadComponent } from '../edit-especialidad/edit-especialidad.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-especialidades-list',
  templateUrl: './especialidades-list.component.html',
  styleUrls: ['./especialidades-list.component.css']
})
export class EspecialidadesListComponent implements OnInit {

  displayedColumns: string[] = ['numero', 'nombre', 'accion'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    public router: Router,
    public authService: AuthService,
    private toastr: ToastrService,
    private espeService: EspecialidadService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {

    this.espeService.getAllEspecialidades().subscribe(especialidad => this.dataSource.data = especialidad);
    this.dataSource.paginator = this.paginator;
  }

  onNew() {
    this.openDialogNew();
  }

  onEdit(element) {
    this.openDialogEdit();
    if (element) {
      this.espeService.espeSelected = Object.assign({}, element);
    }
  }

  onDelete(element) {
    const confirmacion = confirm('¿Estas seguro de eliminar esta especialidad?');
    if (confirmacion) {
      this.espeService.deleteEspecialidad(element);
      this.toastr.success('Registro eliminado exitosamente', 'MENSAJE');
    }
  }

  openDialogNew() {
    this.dialog.open(NewEspecialidadComponent);
  }

  openDialogEdit() {
    this.dialog.open(EditEspecialidadComponent);
  }

}
