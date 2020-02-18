import { UserInterface } from './../../models/user-model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, finalize } from 'rxjs/operators';
import { auth } from 'firebase/app';
import { AngularFireStorage } from '@angular/fire/storage';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userSelected: UserInterface = {};

  private filePath: any;
  private downloadURL: Observable<string>;

  private UserCollection: AngularFirestoreCollection<UserInterface>;
  private User: Observable<UserInterface[]>;
  private UserDoc: AngularFirestoreDocument<UserInterface>;

  constructor(
    private AFauth: AngularFireAuth,
    private readonly af: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.AFauth.auth.signInWithEmailAndPassword(email, password)
      .then(userData => { resolve(userData);
      }).catch(err => reject(err));
    });
  }

  getUserbyCedula( cedulaUser: string) {
    this.UserCollection = this.af.collection<UserInterface>(
      'Users', ref => ref.where('cedula', '==', cedulaUser));
    this.User = this.UserCollection.snapshotChanges().pipe(map(
        actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data };
          });
        }
      ));
    return this.User;
  }

  sendEmailtoResetPass(email: string) {
    return new Promise((resolve, reject) => {
      this.AFauth.auth.sendPasswordResetEmail(email)
      .then(userData => { resolve(userData);
      }).catch(err => reject(err));
    });
  }

  isAuth() {
    return this.AFauth.authState.pipe(map(auth => auth));
  }

  isUserAdmin(userUid) {
    return this.af.doc<UserInterface>(`Users/${userUid}`).valueChanges();
  }

  getOneUser(idUser: string) {
    this.UserCollection = this.af.collection<UserInterface>(
      'Users', ref => ref.where('id', '==', idUser));
    this.User = this.UserCollection.snapshotChanges().pipe(map(
        actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data };
          });
        }
      ));
    return this.User;
  }

  // Metodo para actualizar los datos de los usuarios
  updateUser(user: UserInterface, newImage?) {
    if (newImage) {
      this.uploadImage(user, newImage);
    } else {
      this.UserCollection.doc(user.id).update(user);
    }
  }

  private uploadImage(user: UserInterface, image) {
    this.filePath = `ImageUserProfile/${image.name}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image).snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(urlImage => {
            this.downloadURL = urlImage;
            this.saveProfile(user);
          });
        })
      ).subscribe();
  }

  saveProfile(user: UserInterface) {
    user.imagen = this.downloadURL;
    this.UserCollection.doc(user.id).update(user);
  }

  updateUserEmail(user, newEmail) {
    const idUser = user;
    this.UserDoc = this.af.doc<any>(`Users/${idUser}`);
    this.UserDoc.update({
      email: newEmail
    }).then(res => console.log('OK EMAIL'));
  }

  reAuth(email: string, password: string) {
      return  this.AFauth.auth.currentUser.reauthenticateWithCredential(auth.EmailAuthProvider.credential(email, password));
  }

  updateLoginEmail(newEmail: string) {
    return this.AFauth.auth.currentUser.updateEmail(newEmail);
  }

  updatePassword(newPassword: string) {
    return this.AFauth.auth.currentUser.updatePassword(newPassword);
  }

  verificarPerfil(vista: string, rol: string) {
    let vistasAdministrador = [
      { nombre: 'Odontologos' },
      { nombre: 'Especialidades' },
      { nombre: 'Seguros' },
      { nombre: 'Reportes' },
      { nombre: 'perfil' }
  
     
    ];
    let vistasSecretaria = [
      { nombre: 'Pacientes' },
      { nombre: 'CitaMedica' },
      { nombre: 'CitasMedicasRegistradas' },
      { nombre: 'Tratamientos' },
      { nombre: 'Pagos' },
      { nombre: 'Solicitudes' },
      { nombre: 'perfil' }
    
    ];
    if (rol === 'administrador' ) {
      for (let vistasAdministradorKey in vistasAdministrador) {
        if (vistasAdministrador[vistasAdministradorKey].nombre === vista)  {
          return true;
        }
      }
    } else if (rol === 'secretaria') {
      for (let vistasSecretariaKey in vistasSecretaria) {
        if (vistasSecretaria[vistasSecretariaKey].nombre === vista)  {
          return true;
        }
      }
    }
    return false;
  }

  devolverPerfil(vista: string) {
    let promise = new Promise((resolve, reject) => {
    this.isAuth().subscribe(auth => {
      if (auth) {
        let userUid = auth.uid;
        this.isUserAdmin(userUid).subscribe(userRole => {
          let isAdmin: any = Object.assign({}, userRole.roles);
          let isSecret: any = Object.assign({}, userRole.roles);
          isAdmin = isAdmin.hasOwnProperty('administrador');
          isSecret = isSecret.hasOwnProperty('secretaria');
          if(isAdmin) {
             if (this.verificarPerfil(vista,'administrador')) {
              resolve('1');//true
             } else {
              resolve('0');//false
             }  
          }
          if(isSecret) {
             if (this.verificarPerfil(vista,'secretaria')) {
              resolve('1');
             } else {
              resolve('0');
             }            
          }
        });
      } else {
        resolve('0')
      }
    } , error => {
      reject(error)
    });
  });

  return promise;
  }

}
