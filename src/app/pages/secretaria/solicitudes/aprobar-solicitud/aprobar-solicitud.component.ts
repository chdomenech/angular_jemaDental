import { SolicitudService } from './../../../../services/solicitud/solicitud.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-aprobar-solicitud',
  templateUrl: './aprobar-solicitud.component.html',
  styleUrls: ['./aprobar-solicitud.component.css']
})
export class AprobarSolicitudComponent implements OnInit {
  
  solicitudForm = new FormGroup({
    comentario: new FormControl('', Validators.required),
  });

  constructor(
    private toastr: ToastrService,
    public solicitudService: SolicitudService,
    private dialogRef: MatDialogRef<AprobarSolicitudComponent>
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }

  onSaveSolicitud() {

  }

  close(): void {
    this.dialogRef.close();
  }

  msgValidateComentario() {
    return  this.solicitudForm.get('comentario').hasError('required') ? 'Campo obligatorio' :
     '';
  }
}
