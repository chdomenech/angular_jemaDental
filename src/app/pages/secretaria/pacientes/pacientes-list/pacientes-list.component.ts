import { PacienteService } from './../../../../services/paciente/paciente.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { SeguroService } from 'src/app/services/seguro/seguro.service';
import { NewPacienteComponent } from '../new-paciente/new-paciente.component';
import { EditPacienteComponent } from '../edit-paciente/edit-paciente.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-pacientes-list',
  templateUrl: './pacientes-list.component.html',
  styleUrls: ['./pacientes-list.component.css']
})
export class PacientesListComponent implements OnInit {

  displayedColumns: string[] = ['numero', 'hClinica', 'cedula' , 'nombre', 'telefono', 'email', 'seguro',  'accion'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  constructor(
    public router: Router,
    public authService: AuthService,
    private toastr: ToastrService,
    private seguroService: SeguroService,
    private pacienteService: PacienteService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {

    this.pacienteService.getAllPacientes().subscribe(pacientes => this.dataSource.data = pacientes);
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
      this.pacienteService.pacienteSelected = Object.assign({}, element);
    }
  }

  onDelete(element) {
    const confirmacion = confirm('¿Estas seguro de eliminar el paciente?');
    if (confirmacion) {
      this.pacienteService.deletePaciente(element);
      this.toastr.success('Registro eliminado exitosamente', 'MENSAJE');
    }
  }

  openDialogEdit(): void {
    this.dialog.open(EditPacienteComponent);
  }


  openDialogNew(): void {
    this.dialog.open(NewPacienteComponent);
  }

}
