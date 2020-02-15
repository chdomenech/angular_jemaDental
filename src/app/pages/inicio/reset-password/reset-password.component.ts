import { AuthService } from './../../../services/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  // tslint:disable-next-line: max-line-length
  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/;
  email: string;

  resetPassForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.pattern(this.emailPattern)]),
  });

  constructor(
    private toastr: ToastrService,
    public authService: AuthService
  ) { }

  ngOnInit() {
  }

  sendEmail() {
    this.email =  this.resetPassForm.get('email').value;
    this.authService.sendEmailtoResetPass(this.email)
      .then((res) => {
        this.resetPassForm.reset();
        this.toastr.info('Se ha enviado un correo, por favor revise la bandeja de entrada o correo spam');
      }).catch((err) => {
        this.toastr.error('El correo no se encuentra registrado');
      }) ;
  }

  msgValidateEmail() {
    return this.resetPassForm.get('email').hasError('pattern') ? 'Correo electrónico invalido' :
            '';
  }


}
