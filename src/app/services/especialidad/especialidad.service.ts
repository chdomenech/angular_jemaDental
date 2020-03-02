import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { EspecialidadInterface } from './../../models/especialidad-model';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  private EspCollection: AngularFirestoreCollection<EspecialidadInterface>;
  private EspsDoc: AngularFirestoreDocument<EspecialidadInterface>;
  private Especialidad: Observable<EspecialidadInterface[]>;

  public espeSelected: EspecialidadInterface = {};

  public isEdit: boolean;
  public isNew: boolean;

  arrayEspe = [];

  constructor(
    private AFauth: AngularFireAuth,
    private readonly afs: AngularFirestore
  ) {
    this.EspCollection = afs.collection<EspecialidadInterface>('Especialidades',  ref => ref.orderBy('nombre', 'asc'));
    this.Especialidad = this.EspCollection.valueChanges();
    this.Especialidad.subscribe(list => {
      this.arrayEspe = list.map(item => {
        return {
          id: item.id,
          nombre: item.nombre
        };
      });
    });
  }
  getAllEspecialidades() {
    return this.Especialidad = this.EspCollection.snapshotChanges()
    .pipe(map( changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as EspecialidadInterface;
        data.id = action.payload.doc.id;
        return data;
      });
    }));
  }

  updateEspecialidad(especialidad: EspecialidadInterface) {
    return this.EspCollection.doc(especialidad.id).update(especialidad);
  }

  deleteEspecialidad(especialidad: EspecialidadInterface) {
    return this.EspCollection.doc(especialidad.id).delete();

  }

  addEspecialidad(especialidad: EspecialidadInterface) {
    const id = this.afs.createId();
    especialidad.id= id;
    return this.EspCollection.add(especialidad);
  }
}
