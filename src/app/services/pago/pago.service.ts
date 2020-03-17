import { map } from 'rxjs/operators';
import { PagosInterface } from './../../models/pago-model';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private PagoCollection: AngularFirestoreCollection<PagosInterface>;
  private PagoCollectionView: AngularFirestoreCollection<PagosInterface>;
  private PagoCollectionReport: AngularFirestoreCollection<PagosInterface>;
  private PagoDoc: AngularFirestoreDocument<PagosInterface>;
  private Pago: Observable<PagosInterface[]>;
  private PagoView: Observable<PagosInterface[]>;
  private PagoReport: Observable<PagosInterface[]>;
  pagoSelected: PagosInterface = {};

  constructor(
    private readonly afs: AngularFirestore
  ) {
    this.PagoCollection = afs.collection<PagosInterface>('Pagos',  ref => ref.orderBy('fechaPago', 'desc'));
    this.Pago = this.PagoCollection.valueChanges();
    //this.getAllPagos();

  }

  public getAllPagos() {
    return this.Pago = this.PagoCollection.snapshotChanges()
    .pipe(map( changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as PagosInterface;
        data.id = action.payload.doc.id;
        return data;
      });
    }));
  }

  addPago(pago: PagosInterface) {
    return this.PagoCollection.add(pago).then(info =>{
      this.updatePago(pago);
      
    })
  }
  updatePago(pago: PagosInterface) {
      return this.PagoCollection.doc(pago.id).update(pago)
  }

  formatDate(date: Date): string {
    const day =  date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  getPagosToReport(fechaIni: number, fechaFin: number) {
    this.PagoCollectionReport = this.afs.collection(
      'Pagos', ref => ref.where('fechaPago', '>=', fechaIni).where ('fechaPago', '<=', fechaFin));
    this.PagoReport = this.PagoCollectionReport.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      }
    ));
    return this.PagoReport;
  }

  getPagosPacienteToReport(fechaIni: number, fechaFin: number,cedula:any){
    this.PagoCollectionReport = this.afs.collection(
      'Pagos', ref => ref.where('fechaPago', '>=', fechaIni).where ('fechaPago', '<=', fechaFin)
      .where ('cedulaPaciente', '==', cedula));
    this.PagoReport = this.PagoCollectionReport.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      }
    ));
    return this.PagoReport;

  }



  getAllPagosByParams(seguro:any,tratamiento:any,cipaciente:any){
    this.PagoCollectionView = this.afs.collection('Pagos', ref => ref.where('seguro', '==', seguro)
      .where ('tratamiento', '==', tratamiento)
      .where ('cedulaPaciente', '==', cipaciente));
    this.PagoView = this.PagoCollectionView.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      }
    ));
    return this.PagoView;
  }
  

}
