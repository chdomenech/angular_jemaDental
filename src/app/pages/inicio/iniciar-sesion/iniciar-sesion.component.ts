import { AuthService } from './../../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css']
})
export class IniciarSesionComponent implements OnInit {

  cedula: string;
  email: string;
  password: string;
  userArray: any;
  hide: false;
  subscription: Subscription;

  // Validar Formulario
  inicioSesionForm = new FormGroup({
    cedula: new FormControl('', [Validators.required, Validators.minLength(10)]),
    password: new FormControl('', [Validators.required])
  });

  // Permitir solo numeros en campo CEDULA
  allowedChars = new Set('0123456789'.split('').map(c => c.charCodeAt(0)));

  constructor(
    private toastr: ToastrService,
    public authService: AuthService,
    public router: Router,
  ) { }

  ngOnInit() {
  }

  onLogin() {

    this.cedula = this.inicioSesionForm.get('cedula').value;
    this.password = this.inicioSesionForm.get('password').value;

    this.subscription = this.authService.getUserbyCedula(this.cedula).subscribe(user => {

      if (Object.keys(user).length !== 0) {
          this.email = user[0].email;
       }

      this.authService.login(this.email, this.password)
      .then((res) => {
        this.router.navigate(['inicio']);
        this.subscription.unsubscribe();
      }).catch((err) => {
        this.toastr.error('Cédula y/o contraseña incorrectas');
      });
    });

  }

  msgValidateCedula() {
    return this.inicioSesionForm.get('cedula').hasError('required') ? 'Campo Requerido' :
           this.inicioSesionForm.get('cedula').hasError('minlength') ? 'La cédula debe tener 10 digitos' :
    '';
  }

  msgValidatePass() {
    return this.inicioSesionForm.get('password').hasError('required') ? 'Campo Requerido' :
    '';
  }

  // Funcion: permitir solo numeros en campo cedula
  check(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    if (event.keyCode > 31 && !this.allowedChars.has(event.keyCode)) {
      event.preventDefault();
    }
  }

}
