import { SolicitudService } from './../../../../services/solicitud/solicitud.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator,MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ResponderSolicitudComponent } from './../responder-solicitud/responder-solicitud.component';

@Component({
  selector: 'app-solicitudes-list',
  templateUrl: './solicitudes-list.component.html',
  styleUrls: ['./solicitudes-list.component.css']
})
export class SolicitudesListComponent implements OnInit {

  displayedColumns: string[] = ['numero', 'fechaSolicitud', 'nombreSolicitante',
  'emailSolicitante', 'tipoSolicitud', 'descripcion', 'estadoSolicitud' , 'respuesta', 'accion'];
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
      element.estado= "Aprobada";
      this.solicitudService.selectSolicitud = Object.assign({}, element);
    }
    
    this.dialog.open(ResponderSolicitudComponent);
  }

  negarSol(element) {
    if (element) {
      element.estado= "Negada";
      this.solicitudService.selectSolicitud = Object.assign({}, element);      
    }
    this.dialog.open(ResponderSolicitudComponent);    
  }

}
