import { EditProfileComponent } from './../edit-profile/edit-profile.component';
import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { UserInterface } from 'src/app/models/user-model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  email: string;
  pass: string;
  newPass: string;

  hideE: false;
  hidePa: false;
  hidePn: false;

  userUid: string = null;
  user: UserInterface = {};


  emailForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    passActE: new FormControl('', [Validators.required])
   });

  passwordForm = new FormGroup({
   passActP: new FormControl('', [Validators.required]),
   newPass: new FormControl('', [Validators.required, Validators.minLength(8),
                                 Validators.pattern(/^(?=.*[A-Z])/)])
   });

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.userUid = auth.uid;
        this.fillProfile(this.userUid);
      }
    });
  }

  fillProfile(id) {
    this.authService.getOneUser(id).subscribe(usu => {
     usu.map(res => {
      this.user = res,
      this.authService.userSelected = res;
      });
    });
  }

  onEdit() {
    this.openDialog();
  }

  openDialog(): void {
    this.dialog.open(EditProfileComponent);
  }

  updateEmail() {
    this.email = this.emailForm.get('email').value;
    this.pass = this.emailForm.get('passActE').value;
    try {
      this.authService.reAuth(this.user.email, this.pass)
      .then((res) => {
        this.authService.updateLoginEmail(this.email);
        this.authService.updateUserEmail(this.user.id, this.email),
        this.toastr.success('Correo actualizado exitosamente', 'MENSAJE');
        this.emailForm.reset();
      })
      .catch((err) => {
         this.toastr.error('Contraseña incorrecta', 'MENSAJE');
         });
    } catch (error) {
        this.toastr.warning('Por favor ingrese la contraseña actual');
    }
  }

  updatePass() {
    this.pass = this.passwordForm.get('passActP').value;
    this.newPass = this.passwordForm.get('newPass').value;
    try {
       this.authService.reAuth(this.user.email, this.pass)
       .then((res) => {
        this.authService.updatePassword(this.newPass);
        this.toastr.success('Contraseña actualizada exitosamente', 'MENSAJE');
        this.passwordForm.reset();
       })
       .catch((err) => {
        this.toastr.error('Contraseña actual incorrecta', 'MENSAJE');
       });
     } catch (error ) {
      this.toastr.warning('Por favor ingrese la contraseña actual');
     }
  }

  msgValidateEmail() {
    return this.emailForm.get('email').hasError('email') ? 'Correo electrónico invalido' :
           this.emailForm.get('email').hasError('required') ? 'Campo obligatorio' :
            '';
  }

  msgValidatePassE() {
    return this.emailForm.get('passActE').hasError('required') ? 'Campo obligatorio' :

           '';
  }

  msgValidatePass() {
    return  this.passwordForm.get('passActP').hasError('required') ? 'Campo obligatorio' :
            '';
  }

  msgValidateNewPass() {
    return  this.passwordForm.get('newPass').hasError('required') ? 'Campo obligatorio' :
            this.passwordForm.get('newPass').hasError('pattern') ? 'La contraseña debe tener minimo 8 caracteres y una letra mayuscula' :
    '';
  }

}
