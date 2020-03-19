import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';


@Component({
  selector: 'app-validar-perfil',
  templateUrl: './validar-perfil.component.html',
  styleUrls: ['./validar-perfil.component.css']
})
export class ValidarPerfilComponent implements OnInit {

  rutaEntrada:string;
  nombreComponent:string;
  mostrarComponente:boolean;
  constructor(
    public router: Router,
    public authService: AuthService
    ) { }

  ngOnInit() {
    const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
    
    let urlconCaracter = snapshot.url;
    const arraySplit = urlconCaracter.split("/");
    this.rutaEntrada=arraySplit[1];
    const nombreComponente= this.rutaEntradaANombreComponente(this.rutaEntrada);
  this.accesoPorPerfil(nombreComponente);
  }
  rutaEntradaANombreComponente(rutaEntrada:string):string
{
  let nombreComponente:string;
  if(rutaEntrada=='seguros')
  {
    nombreComponente='Seguros';
  }
  else if(rutaEntrada=='especialidades')
  {
    nombreComponente='Especialidades';
  }
  else if(rutaEntrada=='odontologos')
  {
    nombreComponente='Odontologos';
  }
  else if(rutaEntrada=='reportes')
  {
    nombreComponente='Reportes';
  }
  else if(rutaEntrada=='pacientes')
  {
    nombreComponente='Pacientes';
  }
  else if(rutaEntrada=='citas')
  {
    nombreComponente='CitaMedica';
  }
  else if(rutaEntrada=='pagos')
  {
    nombreComponente='Pagos';
  }
  else if(rutaEntrada=='solicitudes')
  {
    nombreComponente='Solicitudes';
  }
  else if(rutaEntrada=='perfil')
  {
    nombreComponente='perfil';
  }
  else if(rutaEntrada=='citasRegistradas')
  {
    nombreComponente='CitasMedicasRegistradas';
  }
  else if(rutaEntrada=='tratamientos')
  {
    nombreComponente='Tratamientos';
  }
  else{
    this.router.navigate(['/inicioSesion']); 
  }
  return nombreComponente;
} 
 accesoPorPerfil(nombreComponente:string)
  {
    this.authService.devolverPerfil(nombreComponente).then(resAux => {
       if (resAux) {
        let valorAux: any = resAux;
        if (valorAux === '1') {
         //Ingreso ok
          this.mostrarComponente=true;
          this.nombreComponent=nombreComponente;
        } else{
          //Permisos insuficientes
          this.router.navigate(['/inicio']); 
        }
      }       
    }).catch(error =>{
      console.log(error);
    });
  }

}
