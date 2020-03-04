import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { SeguroInteface } from './../../models/seguro-model';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeguroService {

  private SeguroCollection: AngularFirestoreCollection<SeguroInteface>;
  private SegurosDoc: AngularFirestoreDocument<SeguroInteface>;
  private Seguro: Observable<SeguroInteface[]>;
  public seguroSelected: SeguroInteface = {};
  arraySeguros = [];

  constructor(
    private AFauth: AngularFireAuth,
    private readonly afs: AngularFirestore
    ) {
    this.SeguroCollection = afs.collection<SeguroInteface>('Seguros',  ref => ref.orderBy('nombre', 'desc'));
    this.getAllSeguros();
    this.Seguro.subscribe(list => {
      this.arraySeguros = list.map(item => {
          return {
            id: item.id,
            nombre: item.nombre,
            email: item.email,
          };
      });
    });
   }

  getAllSeguros() {
    return this.Seguro = this.SeguroCollection.snapshotChanges()
    .pipe(map( changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as SeguroInteface;
        data.id = action.payload.doc.id;
        return data;
      });
    }));
  }

  getSegurosByNameAndEspecialidad(nombre: string, especialidad: string) {
    this.SeguroCollection = this.afs.collection(
      'Seguros', ref => ref.where('nombre', '==', nombre).where('especialidades', 'array-contains-any', [especialidad]));
    this.Seguro = this.SeguroCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      }
    ));
    return this.Seguro;
  }

  updateSeguro(seguro: SeguroInteface) {
    return this.SeguroCollection.doc(seguro.id).update(seguro);
  }

  deleteSeguro(seguro: SeguroInteface) {
    return this.SeguroCollection.doc(seguro.id).delete();
  }

  addSeguro(seguro: SeguroInteface) {
    const id = this.afs.createId();
    seguro.id= id;
    return this.SeguroCollection.add(seguro);
  }
}
