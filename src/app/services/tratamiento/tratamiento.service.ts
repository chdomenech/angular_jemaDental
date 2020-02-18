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

  public selectTratamientosM: TratamientoMInterface = {};

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

    formtDate(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } 
}
