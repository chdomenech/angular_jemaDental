import { map } from 'rxjs/operators';
import { TratamientoMInterface } from '../../models/tratamiento.model';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TratamientoService {

  
  private TratamientoMCollection: AngularFirestoreCollection<TratamientoMInterface>;
  private TratamientoMtDoc: AngularFirestoreDocument<TratamientoMInterface>;
  private Tratamiento: Observable<TratamientoMInterface[]>;
  private tratamientoM: Observable<TratamientoMInterface>;

  public selectTratamientoM: TratamientoMInterface = {};

  TratamientosArray = [];

   constructor(
    private readonly afs: AngularFirestore
  ){
    this.TratamientoMCollection = afs.collection<TratamientoMInterface>('Tratamiento',  ref => ref.orderBy('fecha', 'desc'));
    this.Tratamiento = this.TratamientoMCollection.valueChanges();
    this.Tratamiento.subscribe(list => {
      this.TratamientosArray = list.map(item => {
        return {
          id: item.id,
          fecha: item.fecha,          
          cipaciente: item.cipaciente,
          namepaciente: item.namepaciente,
          seguro: item.seguro,
          especialidad: item.especialidad,
          odontologo: item.odontologo,          
          tratamiento: item.tratamiento,
          precio: item.precio,
          observacion: item.observacion,
          pagos: item.pagos
        };
      });
    });
  }


  getAllTratamientosMedicos() {
    return this.Tratamiento = this.TratamientoMCollection.snapshotChanges()
    .pipe(map( changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as TratamientoMInterface;
        data.id = action.payload.doc.id;
        return data;
      });
    }));
  }

  getTratamientoByParams(cedula:any,seguro:any,tratamiento:any){
    this.TratamientoMCollection = this.afs.collection('Tratamiento', ref => ref.where('seguro', '==', seguro)
      .where ('tratamiento', '==', tratamiento)
      .where ('cipaciente', '==', cedula));
    this.Tratamiento = this.TratamientoMCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      }
    ));
    return this.Tratamiento;
  }

    

  formtDate(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } 

  deleteTratamientoM(tratamiento: TratamientoMInterface) {
    return this.TratamientoMCollection.doc(tratamiento.id).delete();
  }

  updateTratamientoM(tratamiento: TratamientoMInterface) {
    return this.TratamientoMCollection.doc(tratamiento.id).update(tratamiento);
  }

  addTratamientoM(tratamiento: TratamientoMInterface) {
    const id = this.afs.createId();
    tratamiento.id= id;
    return this.TratamientoMCollection.add(tratamiento);
  }
}
