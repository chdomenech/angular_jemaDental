import { SolicitudService } from './../../../../services/solicitud/solicitud.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator,MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AprobarSolicitudComponent } from './../aprobar-solicitud/aprobar-solicitud.component';
import { NegarSolicitudComponent } from './../negar-solicitud/negar-solicitud.component';

@Component({
  selector: 'app-solicitudes-list',
  templateUrl: './solicitudes-list.component.html',
  styleUrls: ['./solicitudes-list.component.css']
})
export class SolicitudesListComponent implements OnInit {

  displayedColumns: string[] = ['numero', 'fechaSolicitud', 'nombreSolicitante',
  'emailSolicitante', 'tipoSolicitud', 'descripcion', 'estadoSolicitud' , 'accion'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  estadoSolicitud: string;

  solicitud: any;

  constructor(
    public router: Router,
    public authService: AuthService,
    public solicitudService: SolicitudService,
    public toastr: ToastrService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {

    this.solicitudService.getAllSolicitudes().subscribe(pago => { this.dataSource.data = pago; });
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  aprobarSol(element) {
    if (element) {
      this.solicitudService.selectSolicitud = Object.assign({}, element);
    }
    this.dialog.open(AprobarSolicitudComponent);
    /*element.estadoSolicitud = 'Aprobada';
    this.solicitudService.updateSolicitud(element);
    this.toastr.success('Solicitud aprobada exitosamente', 'MENSAJE');*/
  }

  negarSol(element) {
    if (element) {
      this.solicitudService.selectSolicitud = Object.assign({}, element);
    }
    this.dialog.open(NegarSolicitudComponent);
    
    /*element.estadoSolicitud = 'Rechazada';
    this.solicitudService.updateSolicitud(element);
    this.toastr.error('Solicitud rechazada', 'MENSAJE');*/
  }

}
