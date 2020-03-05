import { SolicitudService } from './../../../../services/solicitud/solicitud.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material';
import { SolicitudInterface } from './../../../../models/solicitud-model';

@Component({
  selector: 'app-responder-solicitud',
  templateUrl: './responder-solicitud.component.html',
  styleUrls: ['./responder-solicitud.component.css']
})
export class ResponderSolicitudComponent implements OnInit {

  
  solicitudForm = new FormGroup({
    comentario: new FormControl('', Validators.required),
  });

  constructor(
    private toastr: ToastrService,
    public solicitudService: SolicitudService,
    private dialogRef: MatDialogRef<ResponderSolicitudComponent>
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }

  onSaveSolicitud() {

    let newdata: SolicitudInterface;
    let estado  = this.solicitudService.selectSolicitud.estado;
    newdata = this.solicitudService.selectSolicitud;

    newdata.respuesta = this.solicitudForm.get('comentario').value;    
    newdata.estadoSolicitud = estado;
    
    if (this.solicitudService.selectSolicitud!== undefined) {
      this.solicitudService.updateSolicitud(newdata);
      this.toastr.success('Registro actualizado exitosamente', 'MENSAJE');
      this.close();
    } else {
      this.toastr.warning('La solicitud no existe', 'MENSAJE');
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  msgValidateComentario() {
    return  this.solicitudForm.get('comentario').hasError('required') ? 'Campo obligatorio' :
     '';
  }

}
