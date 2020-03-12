import * as jsPDF from 'jspdf'
import 'jspdf-autotable'
import { Injectable } from '@angular/core';
import * as CanvasJS from 'src/assets/canvasjs.min.js';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor() {  }


  exportToPdf(header: any[], body: any, pdfFilename: string, title: string, imgurl:any): void {  
    
    var img = new Image();
    img.src = "../../assets/logo.jpeg";
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/jpeg");
    var data =dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

    var doc = new jsPDF();
    doc.addImage(data, 'JPEG', 25, 5, 155, 45)   
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');     
    doc.text(68, 55, title);
    doc.autoTable({
      margin: { left: 10 },
      head: [header],
      showHead:'firstPage',
      theme: 'grid',
      startY: 75,
      body: body,
    });
	
    doc.addPage();
    doc.addImage(imgurl, 'JPEG', 10, 50, 200, 65)
    doc.save(pdfFilename+".pdf");
  }
  
  exportToPdfPacientes(header: any[], body: any, pdfFilename: string, title: string, paciente: any, imgurl: any, fecha: any): void {    

    var img = new Image();
    img.src = "../../assets/logo.jpeg";
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/jpeg");
    var data =dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

    var doc = new jsPDF();
    doc.addImage(data, 'JPEG', 25, 5, 155, 45)   
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');     
    doc.text(68, 50, title);   
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');  
    doc.text(93, 60, fecha);     
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');  
    doc.text(10, 75, "Nombre: "+ paciente.nombre);
    doc.text(100, 75, "Cedula: "+ paciente.cedula);
    doc.text(10, 85, "Telefono: "+ paciente.telefono);
    doc.text(100, 85, "Email: "+ paciente.email);

    doc.autoTable({
      margin: { left: 10 },
      head: [header],
      showHead:'firstPage',
      theme: 'grid',
      startY: 95,
      body: body,
    });
     
	doc.addPage();
    doc.addImage(imgurl, 'JPEG', 10, 50, 200, 65) 
    doc.save(pdfFilename+".pdf");
  }

}
