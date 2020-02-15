import { map } from 'rxjs/operators';
import { PacienteInterface } from './../../models/paciente-model';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private PacientCollection: AngularFirestoreCollection<PacienteInterface>;
  private pacientDoc: AngularFirestoreDocument<PacienteInterface>;
  private Paciente: Observable<PacienteInterface[]>;

  public pacienteSelected: PacienteInterface = {};
  arrayPacientes = [];

  constructor(
    private readonly afs: AngularFirestore
  ) {
    this.PacientCollection = afs.collection<PacienteInterface>('Pacientes',  ref => ref.orderBy('hClinica', 'desc'));
    this.Paciente = this.PacientCollection.valueChanges();
    this.Paciente.subscribe(list => {
      this.arrayPacientes = list.map(item => {
        return {
          id: item.id,
          cedula: item.cedula,
          nombre: item.nombre,
          seguro: item.seguro,
          hClinica: item.hClinica,
          email: item.email
        };
      });
    });
  }

  getAllPacientes() {
    return this.Paciente = this.PacientCollection.snapshotChanges()
    .pipe(map( changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as PacienteInterface;
        data.id = action.payload.doc.id;
        return data;
      });
    }));
  }

  updatePaciente(paciente: PacienteInterface) {
    return this.PacientCollection.doc(paciente.id).update(paciente);
  }

  deletePaciente(paciente: PacienteInterface) {
    return this.PacientCollection.doc(paciente.id).delete();
  }

  addPaciente(paciente: PacienteInterface) {
    return this.PacientCollection.add(paciente);
  }


}
