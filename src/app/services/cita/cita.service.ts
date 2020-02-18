import { map } from 'rxjs/operators';
import { CitaMInterface } from './../../models/cita-model';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private CitaMCollection: AngularFirestoreCollection<CitaMInterface>;
  private CitaMtDoc: AngularFirestoreDocument<CitaMInterface>;
  private CitasMedicas: Observable<CitaMInterface[]>;
  private citaM: Observable<CitaMInterface>;

  public selectCitaM: CitaMInterface = {};

  citaArray = [];

  constructor(
    private readonly afs: AngularFirestore
  ) {
    this.CitaMCollection = afs.collection<CitaMInterface>('CitasMedicas',  ref => ref.orderBy('fecha', 'desc'));
    this.CitasMedicas = this.CitaMCollection.valueChanges();
    this.CitasMedicas.subscribe(list => {
      this.citaArray = list.map(item => {
        return {
          id: item.id,
          especialidad: item.especialidad,
          horas: item.hora,
          fecha: item.fecha,
          cipaciente: item.cipaciente,
          namepaciente: item.namepaciente,
          odontologo: item.odontologo,
          seguro: item.seguro,
          estado: item.estado
        };
      });
    });
  }

  getAllCitasMedicas() {
    return this.CitasMedicas = this.CitaMCollection.snapshotChanges()
    .pipe(map( changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as CitaMInterface;
        data.id = action.payload.doc.id;
        return data;
      });
    }));
  }

  getAllCitasMedicasNotNow() {

    let date = new Date();
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    
    let fech = date + "";

    const fechaParse = Date.parse(fech);

    this.CitaMCollection = this.afs.collection(
      'CitasMedicas', 
      ref => ref.where('fecha', '<', fechaParse));

    this.CitasMedicas = this.CitaMCollection.snapshotChanges()
    .pipe(map( changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as CitaMInterface;
        data.id = action.payload.doc.id;
        return data;
      });
    }));
    return this.CitasMedicas;
  }

  getAllCitasMedicasNow() {

    let date = new Date();
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    
    let fech = date + "";

    const fechaParse = Date.parse(fech);

    this.CitaMCollection = this.afs.collection(
      'CitasMedicas', 
      ref => ref.where('fecha', '==', fechaParse)
      .where('estado', 'in' ,['pendiente','confirmada']));

    this.CitasMedicas = this.CitaMCollection.snapshotChanges()
    .pipe(map( changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as CitaMInterface;
        data.id = action.payload.doc.id;
        return data;
      });
    }));
    return this.CitasMedicas;
  }

  updateCitaM(cita: CitaMInterface) {
    return this.CitaMCollection.doc(cita.id).update(cita);
  }

  deleteCitaM(cita: CitaMInterface) {
    return this.CitaMCollection.doc(cita.id).delete();
  }

  addCitaM(cita: CitaMInterface) {
    return this.CitaMCollection.add(cita);
  }

  getCitasbyDate(fechaIni: number, fechaFin: number) {
    this.CitaMCollection = this.afs.collection(
      'CitasMedicas', ref => ref.where('estado', '==', 'asistió').where('fecha', '>=', fechaIni).where ('fecha', '<=', fechaFin));
    this.CitasMedicas = this.CitaMCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      }
    ));
    return this.CitasMedicas;
  }

  formtDate(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  getCitasByCedulaP(cedula: string, fechaIni: number, fechaFin: number) {
    this.CitaMCollection = this.afs.collection(
      'CitasMedicas', ref => ref.where('cipaciente', '==', cedula).where('estado', '==', 'asistió').
      where('fecha', '>=', fechaIni).where ('fecha', '<=', fechaFin));
    this.CitasMedicas = this.CitaMCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      }
    ));
    return this.CitasMedicas;
  }

  getCitasByCedulaO(cedula: string, fechaIni: number, fechaFin: number) {
    this.CitaMCollection = this.afs.collection(
      'CitasMedicas', ref => ref.where('estado', '==', 'asistió').where('fecha', '>=', fechaIni)
      .where ('fecha', '<=', fechaFin).where('odontologo', '==', cedula));
    this.CitasMedicas = this.CitaMCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      }
    ));
    return this.CitasMedicas;
  }
}
