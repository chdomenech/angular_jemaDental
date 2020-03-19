import { AuthService } from './../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public userUid: string = null;
  public isAdmin: any = null;
  public isSecret: any = null; 

  constructor(
    private AFauth: AngularFireAuth,
    public authService: AuthService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.authService.isAuth().subscribe(auth => {

      if (auth) {
        this.userUid = auth.uid;

        this.authService.isUserAdmin(this.userUid).subscribe(userRole => {

        this.isAdmin = Object.assign({}, userRole.roles);
        this.isSecret = Object.assign({}, userRole.roles);
        this.isAdmin = this.isAdmin.hasOwnProperty('administrador');
        this.isSecret = this.isSecret.hasOwnProperty('secretaria');
        });
      }else{
        this.router.navigate(['/inicioSesion']); 
      }
    });
  }

  onLogout() {
    this.AFauth.auth.signOut();
    this.router.navigate(['/inicioSesion']);
    
  }


}
