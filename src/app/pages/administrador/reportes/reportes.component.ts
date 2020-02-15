import { CitaService } from './../../../services/cita/cita.service';
import { ReportService } from './../../../services/report/report.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PagoService } from 'src/app/services/pago/pago.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  tipoReporte: string[] = ['Pagos', 'Pacientes Atendidos', 'Citas por Odontólogo'];
  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  tipoRep: string;
  reportForm = new FormGroup({
    tipoReporte : new FormControl('', Validators.required),
    fechaInicio : new FormControl('', Validators.required),
    fechaFin : new FormControl('', Validators.required)
  });
  newArrayP = {
    cedulaPaciente : '',
    nombrePaciente: '',
    seguro: '',
  };

  arrayPacientes = [];

  newArrayO = {
    cedulaOdontologo : '',
    nombreOdontologo: '',
    especialidad: '',
  };

  arrayOdontologos = [];

  fechaIni: number;
  fechaFin: number;

  existRegistros: boolean;
  subscription: Subscription;

  constructor(
    public router: Router,
    public authService: AuthService,
    public toastr: ToastrService,
    public pagoService: PagoService,
    public reportService: ReportService,
    private citasService: CitaService
  ) { }

  ngOnInit() {

  }

  generarReport() {
    this.fechaIni = Date.parse(this.reportForm.get('fechaInicio').value);
    this.fechaFin = Date.parse(this.reportForm.get('fechaFin').value);
    this.tipoRep = this.reportForm.get('tipoReporte').value;

    if (this.fechaIni > this.fechaFin) {
      this.toastr.warning('La fecha inicial no puede ser mayor a la fecha final', 'MENSAJE');
    } else {
      if (this.tipoRep === 'Pagos') {
        this.reportPagos();
      }
      if (this.tipoRep === 'Pacientes Atendidos') {
        this.reportPacientes();
      }
      if (this.tipoRep === 'Citas por Odontólogo') {
        this.reportOdontologos();
      }
    }

  }

  reportPagos() {
    this.displayedColumns =  ['numero', 'fechaPago', 'cedulaPaciente', 'nombrePaciente', 'asuntoPago', 'valorPago'];
    this.pagoService.getPagosToReport(this.fechaIni, this.fechaFin).subscribe(res => {
      if (Object.keys(res).length === 0 ) {
        this.existRegistros = false;
      } else {
        this.existRegistros = true;
        this.dataSource.data = res;
        for (let i = 0; i < res.length; i++) {
          const element = this.dataSource.data[i];
          this.dataSource.data[i]['id'] = '';
          this.dataSource.data[i]['fechaPago'] = this.pagoService.formatDate(new Date(element['fechaPago']));
        }
      }

    });
  }

  reportPacientes() {
   this.arrayPacientes = [];
   this.newArrayP = {
    cedulaPaciente : '',
    nombrePaciente: '',
    seguro: '',
   };
   this.displayedColumns =  ['numero', 'cedulaPaciente', 'nombrePaciente', 'seguro', 'numeroCitas'];
   this.citasService.getCitasbyDate(this.fechaIni, this.fechaFin).subscribe(res => {
    if (Object.keys(res).length === 0 ) {
      this.existRegistros = false;
    } else {
      this.existRegistros = true;
      const pacientes = {};
      const unicosReg = res.filter(e => {
          return pacientes[e.cipaciente] ? false : (pacientes[e.cipaciente] = true);
      });

      for (let i = 0; i < Object.keys(unicosReg).length; i++) {
        this.newArrayP = {
          cedulaPaciente : unicosReg[i].cipaciente,
          nombrePaciente : unicosReg[i].namepaciente,
          seguro: unicosReg[i].seguro
        };
        this.arrayPacientes.push(this.newArrayP);
      }

      this.dataSource.data = this.arrayPacientes;

      this.arrayPacientes.forEach(element => {
        this.subscription = this.citasService.getCitasByCedulaP(element.cedulaPaciente, this.fechaIni, this.fechaFin).subscribe(resp => {
          const tam = Object.keys(this.dataSource.data).length;
          for (let i = 0; i < tam; i++) {
            if (this.dataSource.data[i]['cedulaPaciente'] === element.cedulaPaciente) {
                  this.dataSource.data[i]['numeroCitas'] = Object.keys(resp).length;
                }
              }
        });
      });
    }
   });
  }

  reportOdontologos() {
   this.arrayOdontologos = [];
   this.newArrayO = {
    cedulaOdontologo : '',
    nombreOdontologo: '',
    especialidad: '',
   };
   this.displayedColumns =  ['numero', 'cedulaOdontologo', 'nombreOdontologo', 'especialidad','numeroCitas'];
   this.citasService.getCitasbyDate(this.fechaIni, this.fechaFin).subscribe(res => {
    if (Object.keys(res).length === 0 ) {
      this.existRegistros = false;
    } else {
      this.existRegistros = true;
      const odontologos = {};
      const unicosReg = res.filter(e => {
          return odontologos[e.odontologo] ? false : (odontologos[e.odontologo] = true);
      });

      for (let i = 0; i < Object.keys(unicosReg).length; i++) {
        this.newArrayO = {
          cedulaOdontologo : unicosReg[i].odontologo,
          nombreOdontologo : unicosReg[i].nameodontologo,
          especialidad: unicosReg[i].especialidad
        };
        this.arrayOdontologos.push(this.newArrayO);
      }

      this.dataSource.data = this.arrayOdontologos;

      this.arrayOdontologos.forEach(element => {
        this.subscription = this.citasService.getCitasByCedulaO(element.cedulaOdontologo, this.fechaIni, this.fechaFin)
        .subscribe(resp => {
          const tam = Object.keys(this.dataSource.data).length;
          for (let i = 0; i < tam; i++) {
            if (this.dataSource.data[i]['cedulaOdontologo'] === element.cedulaOdontologo) {
                  this.dataSource.data[i]['numeroCitas'] = Object.keys(resp).length;
                }

              }
        });
      });
    }
   });

  }

  exportTablePagos() {
    this.reportService.exportToExcel(this.dataSource.data, 'pagosReport');
  }

  exportTablePacientes() {
    this.reportService.exportToExcel(this.dataSource.data, 'pacientesReport');
  }

  exportTableOdontologos() {
    this.reportService.exportToExcel(this.dataSource.data, 'odontologosReport');
  }

  getErrorMsgTipo() {
    return this.reportForm.get('tipoReporte').hasError('required') ? 'Seleccione el tipo de reporte' :
     '';
  }
  getErrorMsgFechaIni() {
    return this.reportForm.get('fechaInicio').hasError('required') ? 'Fecha erronea' :
     '';
  }
  getErrorMsgFechaFin() {
    return this.reportForm.get('fechaFin').hasError('required') ? 'Fecha erronea' :
     '';
  }

}
