import { map } from 'rxjs/operators';
import { SolicitudInterface } from './../../models/solicitud-model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  private SolicitudCollection: AngularFirestoreCollection<SolicitudInterface>;
  private SolicitudDoc: AngularFirestoreDocument<SolicitudInterface>;
  private Solicitud: Observable<SolicitudInterface[]>;
  public selectSolicitud: SolicitudInterface = {};

  constructor(
    private readonly afs: AngularFirestore
  ) {
    this.SolicitudCollection = afs.collection<SolicitudInterface>('SolicitudesQNS',  ref => ref.orderBy('fechaSolicitud', 'desc'));
    this.Solicitud = this.SolicitudCollection.valueChanges();
  }

  public getAllSolicitudes() {
    return this.Solicitud = this.SolicitudCollection.snapshotChanges()
    .pipe(map( changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as SolicitudInterface;
        data.id = action.payload.doc.id;
        return data;
      });
    }));
  }

  updateSolicitud(solicitud: SolicitudInterface) {
    return this.SolicitudCollection.doc(solicitud.id).update(solicitud);
  }
}
