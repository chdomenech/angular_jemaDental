import { map, finalize } from 'rxjs/operators';
import { OdontologoInterface } from './../../models/odontologo-model';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class OdontologoService {

  private OdontCollection: AngularFirestoreCollection<OdontologoInterface>;
  private OdontDoc: AngularFirestoreDocument<OdontologoInterface>;
  private Odontologo: Observable<OdontologoInterface[]>;

  private filePath: any;
  private downloadURL: Observable<string>;
  // tslint:disable-next-line: max-line-length
  defaultImg: any = 'https://firebasestorage.googleapis.com/v0/b/jema-dental.appspot.com/o/imageOdontProfile%2Fuserphoto.png?alt=media&token=79e54081-7486-41ec-b380-e3ff34def585';


  public odontologoSelected: OdontologoInterface;
  public odontologoSelectedBorrar: OdontologoInterface;

  arrayOdontologos = [];

  constructor(
    private readonly afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.OdontCollection = afs.collection<OdontologoInterface>('Odontologos',  ref => ref.orderBy('nombre', 'asc'));
    this.Odontologo = this.OdontCollection.valueChanges();
    this.Odontologo.subscribe(list => {
      this.arrayOdontologos = list.map(item => {
        return {
          id: item.id,
          nombre: item.nombre,
          cedula: item.cedula,
          email: item.email,
          especialidad: item.especialidad,
          horas: item.horario
        };
      });
    });
  }

  getAllOdontologos() {
    return this.Odontologo = this.OdontCollection.snapshotChanges()
    .pipe(map( changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as OdontologoInterface;
        data.id = action.payload.doc.id;
        return data;
      });
    }));
  }

  public addNewOdontologo(odontologo: OdontologoInterface, img?): void {
    if (img) {
      this.uploadImage(odontologo, img);
    } else {
      const id = this.afs.createId();
      odontologo.id= id;
      this.OdontCollection.add(odontologo);
    }
  }

  public editOdontologo(odontologo: OdontologoInterface, img?) {
    if (img) {
      this.uploadImage(odontologo, img);
    } else {
      this.OdontCollection.doc(odontologo.id).update(odontologo);
    }
  }

  private uploadImage(odontologo: OdontologoInterface, image) {
    this.filePath = `ImageOdontProfile/${image.name}`;
    const fileRef = this.storage.ref(this.filePath);
    this.storage.upload(this.filePath, image).snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(urlImage => {
            this.downloadURL = urlImage;
            this.saveOdontologo(odontologo);
          });
        })
      ).subscribe();
  }

  private saveOdontologo(odontologo: OdontologoInterface) {
    odontologo.foto = this.downloadURL;
    if (odontologo.id) {
      return this.OdontCollection.doc(odontologo.id).update(odontologo);
    } else {
      return this.OdontCollection.add(odontologo);
    }
  }

  deleteOdontologo(odontologo: OdontologoInterface) {
    return this.OdontCollection.doc(odontologo.id).delete();
  }

}
