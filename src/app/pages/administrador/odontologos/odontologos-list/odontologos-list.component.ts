import { EspecialidadService } from './../../../../services/especialidad/especialidad.service';
import { NewOdontologoComponent } from './../new-odontologo/new-odontologo.component';
import { OdontologoService } from './../../../../services/odontologo/odontologo.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { EditOdontologoComponent } from '../edit-odontologo/edit-odontologo.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import {OdontologoInterface} from 'src/app/models/odontologo-model';


@Component({
  selector: 'app-odontologos-list',
  templateUrl: './odontologos-list.component.html',
  styleUrls: ['./odontologos-list.component.css']
})
export class OdontologosListComponent implements OnInit {

  displayedColumns: string[] = ['numero', 'foto', 'nombre' , 'cedula', 'especialidad', 'email', 'telefono','diasLaborales', 'jornadaLaboral', 'accion'];
  dataSource = new MatTableDataSource();
  odontologo : OdontologoInterface;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    public router: Router,
    public authService: AuthService,
    private toastr: ToastrService,
    private odontService: OdontologoService,
    private espeService: EspecialidadService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {

    this.odontService.getAllOdontologos().subscribe(odontologos => {
      this.dataSource.data = odontologos
      const tam = Object.keys(this.dataSource.data).length;
      for (let i = 0; i< tam; i++){
        let element = odontologos[i];
        let dias = new Array();
        const horarios = element.horario;
        const tam1 = Object.keys(horarios).length;
        for (let i = 0; i<tam1; i++){
          dias.push(horarios[i].dia);
        }
        this.dataSource.data[i]['diasLaborales']=dias;
      }
    
    });
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEdit(element) {
    this.openDialogEdit();
    if (element) {
      this.odontService.odontologoSelected = Object.assign({}, element);
    }
  }

  onNew() {
    this.openDialogNew();
   }

  openDialogNew(): void {
    this.dialog.open(NewOdontologoComponent);
  }

  openDialogEdit(): void {
    this.dialog.open(EditOdontologoComponent);
  }

  onDelete(element) {
    const confirmacion = confirm('¿Estas seguro de eliminar el odontólogo?');
    if (confirmacion) {
      this.odontService.deleteOdontologo(element);
      this.toastr.success('Registro eliminado exitosamente', 'MENSAJE');
    }
  }

}
