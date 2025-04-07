import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ArchivoImpugnacion } from 'src/app/models/Bases/archivoImpugnacion';
import { BasesImpugnacionService } from 'src/app/models/Bases/BasesImpugnacion.service';
import { BasesImpugnar } from 'src/app/models/Bases/basesImpugnar';
import { AzureBlobStorageService } from 'src/app/shared/services/azure-blob-storage.service';
import Swal from 'sweetalert2';
import { registroImpugnacionBaseComponent } from './registroImpugnacionBase.component';

@Component({
  selector: 'app-upload2',
  templateUrl: './upload2.component.html',
  styleUrls: [ './upload2.component.scss' ]
})
export class Upload2Component {
  @Input() data:BasesImpugnar [];
  files: any[] = [];
  mesesImpugnados: string[] = [];
  mesesSeleccionados: string[] = [];
  modalMesesContrato: any;
  modalReference: any;
  
  
  constructor(private blobService: AzureBlobStorageService,
    private baseImpugnarService: BasesImpugnacionService,
    private registroImpugnacionBase: registroImpugnacionBaseComponent,
    private modalService: NgbModal){}

  
  //al arrastrar los archivos
  onFileDropped($event, modalSeleccionarMesContrato: any) {
    this.files = $event;
    this.modalMesesContrato = modalSeleccionarMesContrato;
    this.validarMesesContrato();
  }

  //al adjuntar los archivos desde el explorador
  fileBrowseHandler(files, modalSeleccionarMesContrato: any) {
    this.files = files;
    this.modalMesesContrato = modalSeleccionarMesContrato;
    this.validarMesesContrato();
  }

  validarMesesContrato(){
    this.mesesImpugnados = [];
    this.mesesSeleccionados = [];
    for (const item of this.data){
      // if(item.temp_Impugnar && item.temp_Valor != undefined && item.temp_OrigenImpugnacion != undefined && item.temp_FechaTermino != undefined){
      if(item.temp_Impugnar && item.temp_Valor != undefined && item.temp_OrigenImpugnacion != undefined){
        this.mesesImpugnados.push(item.temp_MonthContract);
      }
    }
    if (this.mesesImpugnados.length > 0){
      this.modalReference = this.modalService.open(this.modalMesesContrato,{windowClass : "claseConsulta",centered: true,backdrop : 'static',keyboard : false});
    }
    else{
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Debe realizar al menos una impugnación para asociar los sustentos.',
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#4b822d'
      });
    }
  }

  seleccionarMesContrato(e, mes: string){
    if (e.checked){
      this.mesesSeleccionados.push(mes);
    }
    else{
      this.mesesSeleccionados.forEach((element, index) => {
        if(element == mes) this.mesesSeleccionados.splice(index,1);
      })
    }
  }

  confirmarSeleccionMesContrato(){
    if(this.mesesSeleccionados.length > 0){
      this.cargarArchivo();
      this.modalReference.close();
    }
    else{
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Debe seleccionar al menos un mes de contrato al cual asociar los sustentos adjuntos.',
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#4b822d'
      });
    }
  }

  asociarArchivoImpugnacionExistente(nombreArchivo: string, idBaseImpugn: number){
    let archivoImpugnacion: ArchivoImpugnacion = new ArchivoImpugnacion;
    archivoImpugnacion = new ArchivoImpugnacion;
    archivoImpugnacion.t442_ID = 0; //El ID no se inserta, es autoincrmeental
    archivoImpugnacion.t442_BasisImpugn = idBaseImpugn;
    archivoImpugnacion.t442_SupportFile = nombreArchivo;
    this.baseImpugnarService.guardarArchivoImpugnacion(archivoImpugnacion).subscribe(
      (response: ArchivoImpugnacion) => {
        archivoImpugnacion = response;
        this.registroImpugnacionBase.getListaBasesImpugnar(this.registroImpugnacionBase.fecha, this.registroImpugnacionBase.idSubyacente);
      }
    );
  }

  asociarArchivoNuevaImpugnacion(item: BasesImpugnar, nombreArchivo: string, key: number){
    console.log("archivo para nueva impugnación");
    if(item.temp_SustentosAsociados){
      item.temp_SustentosAsociados += "/";
    }
    item.temp_SustentosAsociados += nombreArchivo;
  }

  asociarArchivoImpugnacion(nombreArchivo: string, key: number){
    for (const item of this.data){
      if(item.temp_Impugnar && !item.temp_SustentosAsociados.split("/").includes(nombreArchivo) && this.mesesSeleccionados.includes(item.temp_MonthContract)){
        if(item.temp_ID_BaseImpugn){
          this.asociarArchivoImpugnacionExistente(nombreArchivo, item.temp_ID_BaseImpugn);
        }
        else{
          this.asociarArchivoNuevaImpugnacion(item, nombreArchivo, key);
        }
      }
    }
  }

  cargarArchivo(){
    if (this.mesesSeleccionados.length > 0){
      let indice: number = 0;
      for (const item of this.files) {
          this.blobService.uploadFile(item, item.name, () => {
          this.asociarArchivoImpugnacion(item.name, indice);
          indice++;
        });
      }
    }
  }

}